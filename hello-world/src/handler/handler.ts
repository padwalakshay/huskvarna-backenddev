import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { handleUpload, handleGetImage, handleDeleteImage } from '@handler/router';
import { ResponseObj } from '@interfaces/s3ServiceConfig';

export const lambdaHandler = async (event: APIGatewayProxyEventV2): Promise<ResponseObj | any> => {
    try {
        const path = event['rawPath'];
        const method = event['requestContext']['http']['method'];

        if (path === '/upload' && method === 'POST') {
            return handleUpload(event);
        } else if (path === '/getImage' && method === 'GET') {
            return handleGetImage(event);
        } else if (path === '/delete' && method === 'DELETE') {
            return handleDeleteImage(event);
        }

        return {
            status: 400,
            message: 'Invalid path or method',
        };
    } catch (err) {
        return {
            status: 500,
            message: JSON.stringify({ message: 'An error occurred', err }),
        };
    }
};
