// tests/unit/handler.spec.ts
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { lambdaHandler } from "../../app";  // update path as needed

// Mock S3Service and DbService
jest.mock("../../src/services/S3Service");
jest.mock("../../src/services/DbService");

import { S3Service } from "../../src/services/S3Service";
import { DbService } from "../../src/services/DbService";

const mockUploadFile = jest.fn();
const mockDeleteFile = jest.fn();
(S3Service as jest.Mock).mockImplementation(() => {
  return {
    uploadFile: mockUploadFile,
    deleteFile: mockDeleteFile,
  };
});

const mockUploadRecord = jest.fn();
const mockDeleteRecord = jest.fn();
const mockGetList = jest.fn();
(DbService as jest.Mock).mockImplementation(() => {
  return {
    uploadRecord: mockUploadRecord,
    deleteRecord: mockDeleteRecord,
    getList: mockGetList,
  };
});

describe("lambdaHandler", () => {
  beforeEach(() => {
    // reset mocks before each test
    jest.clearAllMocks();
  });

  it("handles /upload POST correctly", async () => {
    const fakeBody = {
      image: Buffer.from("dummy-image-data").toString("base64"),
      id: 123,
      fileName: "myfile.jpg"
    };

    const event = {
      rawPath: "/upload",
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify(fakeBody),
    } as unknown as APIGatewayProxyEventV2;

    const result = await lambdaHandler(event);

    expect(mockUploadFile).toHaveBeenCalled();
    expect(mockUploadRecord).toHaveBeenCalled();

    expect(result.status).toBe(200);
    expect(typeof result.message).toBe("string");
    // optionally check that the returned URL contains bucket name or id
    expect(result.message).toContain("https://");
  });

  it("returns 400 when upload missing required fields", async () => {
    const fakeBadBody = { id: 456 };  // missing image or fileName

    const event = {
      rawPath: "/upload",
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify(fakeBadBody),
    } as unknown as APIGatewayProxyEventV2;

    const result = await lambdaHandler(event);

    expect(mockUploadFile).not.toHaveBeenCalled();
    expect(mockUploadRecord).not.toHaveBeenCalled();

    expect(result.status).toBe(400);
    expect(result.message).toMatch(/required/);
  });

  it("handles /getImage GET correctly", async () => {
    const fakeList = { Items: [{ imageid: "img1" }], Count: 1 };
    mockGetList.mockResolvedValue(fakeList);

    const event = {
      rawPath: "/getImage",
      requestContext: { http: { method: "GET" } },
      queryStringParameters: { userid: "42" },
    } as unknown as APIGatewayProxyEventV2;

    const result = await lambdaHandler(event);

    expect(mockGetList).toHaveBeenCalledWith(42);
    expect(result.status).toBe(200);
    expect(result.message).toContain(JSON.stringify(fakeList));
  });

  it("handles /delete DELETE correctly", async () => {
    mockDeleteFile.mockResolvedValue(undefined);
    mockDeleteRecord.mockResolvedValue(undefined);

    const event = {
      rawPath: "/delete",
      requestContext: { http: { method: "DELETE" } },
      queryStringParameters: { userid: "42", uuid: "my‑uuid" },
    } as unknown as APIGatewayProxyEventV2;

    const result = await lambdaHandler(event);

    expect(mockDeleteFile).toHaveBeenCalled();
    expect(mockDeleteRecord).toHaveBeenCalledWith(42, "my‑uuid");
    expect(result.status).toBe(200);
    expect(result.message).toMatch(/deleted/i);
  });

  it("returns 404 for unsupported path", async () => {
    const event = {
      rawPath: "/unknown",
      requestContext: { http: { method: "GET" } },
    } as unknown as APIGatewayProxyEventV2;

    const result = await lambdaHandler(event);

    expect(result.status).toBe(404);
  });

  it("returns 500 when S3 upload fails", async () => {
    mockUploadFile.mockRejectedValue(new Error("upload failed"));

    const fakeBody = {
      image: Buffer.from("data").toString("base64"),
      id: 1,
      fileName: "file.jpg"
    };
    const event = {
      rawPath: "/upload",
      requestContext: { http: { method: "POST" } },
      body: JSON.stringify(fakeBody),
    } as unknown as APIGatewayProxyEventV2;

    const result = await lambdaHandler(event);

    expect(result.status).toBe(500);
    expect(result.message).toMatch(/Upload error/);
  });
});
