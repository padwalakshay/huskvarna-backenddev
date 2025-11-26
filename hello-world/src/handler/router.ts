import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { S3Service } from '@services/S3Service';
import { DbService } from '@services/DbService';
import { ResponseObj } from '@interfaces/s3ServiceConfig';
import { v4 as uuidv4 } from 'uuid';

const config = { region: 'us-east-1', accessKeyId: 'AKIAQ3AXJBWPLFU7WA4R', secretAccessKey: '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' };
const bucketName = process.env.BUCKET_NAME!;
const tableName = process.env.TABLE_NAME!;
const s3 = new S3Service(config, bucketName);
const db = new DbService(config, tableName);

export const handleUpload = async (event: APIGatewayProxyEventV2): Promise<ResponseObj | any> => {
    try {
        const body = JSON.parse(event.body!);

        if (!body.image || !body.fileName) {
            return {
                status: 400,
                message: 'Image and filename are required',
            };
        }

        const { image, id, fileName } = body;
        const imageid = uuidv4();
        const buffer = Buffer.from(image, 'base64');
        const path = `user/${id}/${imageid}`;

        await s3.uploadFile(path, buffer, 'image/jpeg');
        await db.uploadRecord({ userid: id, imageid, fileName, bucketname: bucketName, imageurl: `https://${bucketName}.s3.amazonaws.com/${path}` });

        return {
            status: 200,
            message: `File uploaded successfully! Image URL: https://${bucketName}.s3.amazonaws.com/${path}`,
        };
    } catch (error) {
        return {
            status: 500,
            message: `Error uploading file: ${error}`,
        };
    }
};

export const handleGetImage = async (event: APIGatewayProxyEventV2): Promise<ResponseObj | any> => {
    try {
        const userid = parseInt(event.queryStringParameters!.userid!);
        const list = await db.getList(userid);
        return {
            status: 200,
            message: 'List of records for the user',
            list: list?.Items || [],
        };
    } catch (error) {
        return {
            status: 500,
            message: `Error fetching records: ${error}`,
        };
    }
};

export const handleDeleteImage = async (event: APIGatewayProxyEventV2): Promise<ResponseObj | any> => {
    try {
        const userid = parseInt(event.queryStringParameters!.userid!);
        const uuid = event.queryStringParameters!.uuid!;
        const key = `user/${userid}/${uuid}`;

        await s3.deleteFile(key);
        await db.deleteRecord(userid, uuid);

        return {
            status: 200,
            message: 'Record deleted successfully',
        };
    } catch (error) {
        return {
            status: 500,
            message: `Error deleting record: ${error}`,
        };
    }
};
