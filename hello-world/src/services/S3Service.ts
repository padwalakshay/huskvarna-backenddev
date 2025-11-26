import { S3Client, PutObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";

import { S3ServiceConfig } from '../interfaces/s3ServiceConfig';

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(config: S3ServiceConfig, bucketName: string) {
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId || 'NA',
        secretAccessKey: config.secretAccessKey || 'NA',
      },
    });
    this.bucketName = bucketName;
  }

  public async uploadFile(key: string, body: Buffer | ReadableStream | Blob | string, contentType: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    await this.s3Client.send(command);
  }

  public async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }
}