import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '@services/S3Service';
import { DbService } from '@services/DbService';
import { ResponseObj } from '@interfaces/s3ServiceConfig';
const config = {region: 'us-east-1', accessKeyId: '', secretAccessKey: ''}
const bucketName = process.env.BUCKET_NAME!;
const tableName = process.env.TABLE_NAME!;
const s3 = new S3Service(config, bucketName);
const db = new DbService(config, tableName);
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEventV2): Promise<ResponseObj | any> => {
    try {

        if (!bucketName || !tableName) {
            throw new Error("Required environment variables are missing");
        }

        const path = event['rawPath'];
        const method = event['requestContext']['http']['method'];
        if(path && path === '/upload' && method === 'POST') {
            try {
                const body = JSON.parse(event.body!)
                if (!body.image || !body.fileName) {
                    return {
                        status: 400,
                        message: "image and filename required"
                    };
                }
                const { image, id, fileName } = body;
                const imageid = `${uuidv4()}`;
                const buffer = Buffer.from(image, "base64");
                const path = `user/${id}/${imageid}`;
                await s3.uploadFile(`${path}`, buffer, 'image/jpeg')
                await db.uploadRecord({userid:id, imageid, fileName, bucketname: bucketName, imageurl: `https://${bucketName}.s3.amazonaws.com/${path}`})
                return {
                    status: 200,
                    message: `https://${bucketName}.s3.amazonaws.com/${path}`
                }
            } catch (error) {
                return {
                    status: 500,
                    message: `Error happened at upload path - ${error}`
                }
            }
        } else if (path && path === '/getImage' && method === 'GET'){
            try {
                const userid = parseInt(event.queryStringParameters!.userid!);
                const list = await db.getList(userid);
                const items = await list?.Items;
                return {
                    status: 200,
                    message: 'List of records for the user',
                    list: JSON.stringify(items)
                }
            } catch (error) {
                return {
                    status: 500,
                    message: `Error happened at getImage path - ${error}`
                }
            }
        } else if (path && path === '/delete' && method === 'DELETE') {
             try {
                const userid = parseInt(event.queryStringParameters!.userid!);
                const uuid = event.queryStringParameters!.uuid!;
                const key = `user/${userid}/${uuid}`;
                await s3.deleteFile(key);
                await db.deleteRecord(userid, uuid);
                return {
                    status: 200,
                    message: 'Record deleted succesfully'
                } 
            } catch (error) {
                return {
                    status: 500,
                    message: `Error happened at delete path - ${error}`
                }
            }
        }
        return {
            status: 200,
            message: 'Lamda function is working'
        }
    } catch (err) {
        return {
            status: 500,
            message: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
