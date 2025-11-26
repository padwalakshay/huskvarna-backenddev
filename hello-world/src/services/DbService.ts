import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";

import { S3ServiceConfig, DataObject } from "../interfaces/s3ServiceConfig";

export class DbService {
    private DbCient: DynamoDBClient;
    private tableName: string;
    constructor(config: S3ServiceConfig, tableName: string) {
        this.DbCient = new DynamoDBClient({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId || '',
                secretAccessKey: config.secretAccessKey || '',
            },
        })
        this.tableName = tableName;
    }

    public async uploadRecord(config: DataObject): Promise<void> {
        const ddb = DynamoDBDocumentClient.from(this.DbCient);
        await ddb.send(new PutCommand({ TableName: this.tableName, Item: config }));
    }

    public async deleteRecord(userid: number, uuid: string): Promise<void> {
        const params = {
        TableName: this.tableName,
            Key: {
                userid,
                imageid: uuid,
            },
        };
        await this.DbCient.send(new DeleteCommand(params));
    }

    public async getList(userid: number) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: "#pk = :pkval",
            ExpressionAttributeNames: {
                "#pk":  'userid',
            },
            ExpressionAttributeValues: {
                ":pkval": userid
            }
        };
        try {
            return await this.DbCient.send(new QueryCommand(params));
        } catch (error) {
            console.log(error)
        }
    }
}