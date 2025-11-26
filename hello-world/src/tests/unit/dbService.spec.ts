// tests/unit/dbService.spec.ts

import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { DbService } from "../../src/services/DbService";
import { S3ServiceConfig, DataObject } from "../../src/interfaces/s3ServiceConfig";

describe("DbService", () => {
  const fakeConfig: S3ServiceConfig = {
    region: "us-east-1",
    accessKeyId: "AKIA_FAKE",
    secretAccessKey: "SECRET",
  };
  const tableName = "MyTable";

  // Mock clients
  const ddbDocMock = mockClient(DynamoDBDocumentClient);
  const ddbClientMock = mockClient(DynamoDBClient);

  let service: DbService;

  beforeEach(() => {
    ddbDocMock.reset();    // reset any previous behavior or history
    ddbClientMock.reset();
    service = new DbService(fakeConfig, tableName);
  });

  it("uploadRecord should send a PutCommand with correct parameters", async () => {
    const item: DataObject = {
      fileName: "file.jpg",
      bucketname: "bucket",
      imageid: "img-123",
      userid: 42,
      imageurl: "https://example.com/file.jpg",
    };

    ddbDocMock.on(PutCommand).resolves({});

    await service.uploadRecord(item);

    const calls = ddbDocMock.commandCalls(PutCommand);
    expect(calls.length).toBe(1);

    const cmd = calls[0].args[0] as PutCommand;
    const cmdInput = (cmd as any).input;
    expect(cmdInput).toMatchObject({
      TableName: tableName,
      Item: item,
    });
  });

  it("deleteRecord should send a DeleteCommand with correct key", async () => {
    const userid = 42;
    const uuid = "img-123";

    ddbClientMock.on(DeleteCommand).resolves({});

    await service.deleteRecord(userid, uuid);

    const calls = ddbClientMock.commandCalls(DeleteCommand);
    expect(calls.length).toBe(1);

    const cmd = calls[0].args[0] as DeleteCommand;
    const cmdInput = (cmd as any).input;
    expect(cmdInput).toMatchObject({
      TableName: tableName,
      Key: {
        userid,
        imageid: uuid,
      },
    });
  });

  it("getList should query with correct KeyConditionExpression and return response", async () => {
    const userid = 42;
    const fakeItems = [
      { userid: 42, imageid: "a", filename: "f1", bucketname: "b", imageurl: "u1" },
      { userid: 42, imageid: "b", filename: "f2", bucketname: "b", imageurl: "u2" },
    ];

    ddbDocMock.on(QueryCommand).resolves({
      Items: fakeItems,
      Count: fakeItems.length,
    });

    const result = await service.getList(userid);

    expect(result?.Items).toEqual(fakeItems);

    const calls = ddbDocMock.commandCalls(QueryCommand);
    expect(calls.length).toBe(1);

    const cmd = calls[0].args[0] as QueryCommand;
    const cmdInput = (cmd as any).input;
    expect(cmdInput).toMatchObject({
      TableName: tableName,
      KeyConditionExpression: "#pk = :pkval",
      ExpressionAttributeNames: { "#pk": "userid" },
      ExpressionAttributeValues: { ":pkval": userid },
    });
  });

  it("getList should handle error gracefully", async () => {
    const userid = 999;

    ddbDocMock.on(QueryCommand).rejects(new Error("Mock error"));

    const result = await service.getList(userid);

    expect(result).toBeUndefined();
  });
});
