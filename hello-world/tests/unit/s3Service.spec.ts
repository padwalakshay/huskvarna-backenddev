// tests/unit/s3Service.spec.ts

import { mockClient } from "aws-sdk-client-mock";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3Service } from "../../src/services/S3Service";
import { S3ServiceConfig } from "../../src/interfaces/s3ServiceConfig";

describe("S3Service", () => {
  const fakeConfig: S3ServiceConfig = {
    region: "us-west-2",
    accessKeyId: "FAKE_KEY",
    secretAccessKey: "FAKE_SECRET",
  };
  const bucketName = "my-test-bucket";
  let s3Service: S3Service;

  const s3Mock = mockClient(S3Client);

  beforeEach(() => {
    s3Mock.reset();
    s3Service = new S3Service(fakeConfig, bucketName);
  });

  it("should upload a file (PutObjectCommand)", async () => {
    const key = "test-key";
    const body = "hello-world";
    const contentType = "text/plain";

    s3Mock.on(PutObjectCommand).resolves({});

    await s3Service.uploadFile(key, body, contentType);

    // Get the calls to PutObjectCommand
    const calls = s3Mock.commandCalls(PutObjectCommand);
    expect(calls.length).toBe(1);

    const cmd = calls[0].args[0] as PutObjectCommand;
    expect(cmd.constructor.name).toBe("PutObjectCommand");

    // Assert each property individually
    expect((cmd as any).input.Bucket).toBe(bucketName);
    expect((cmd as any).input.Key).toBe(key);
    expect((cmd as any).input.Body).toBe(body);
    expect((cmd as any).input.ContentType).toBe(contentType);
  });

  it("should delete a file (DeleteObjectCommand)", async () => {
    const key = "delete-key";

    s3Mock.on(DeleteObjectCommand).resolves({});

    await s3Service.deleteFile(key);

    const calls = s3Mock.commandCalls(DeleteObjectCommand);
    expect(calls.length).toBe(1);

    const cmd = calls[0].args[0] as DeleteObjectCommand;
    expect(cmd.constructor.name).toBe("DeleteObjectCommand");

    expect((cmd as any).input.Bucket).toBe(bucketName);
    expect((cmd as any).input.Key).toBe(key);
  });

  it("should propagate error if upload fails", async () => {
    const key = "error-upload";
    const body = "data";
    const contentType = "application/json";

    s3Mock.on(PutObjectCommand).rejects(new Error("S3 upload error"));

    await expect(s3Service.uploadFile(key, body, contentType)).rejects.toThrow("S3 upload error");
  });

  it("should propagate error if delete fails", async () => {
    const key = "error-delete";

    s3Mock.on(DeleteObjectCommand).rejects(new Error("S3 delete error"));

    await expect(s3Service.deleteFile(key)).rejects.toThrow("S3 delete error");
  });
});
