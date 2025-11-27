export interface S3ServiceConfig {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
}

export interface ResponseObj {
    status: number;
    message: string;
    list: DataObject[] | []
}


export interface DataObject {
    userid: number;
    imageid: string
    fileName: string
    bucketname: string;
    imageurl: string
}

export interface ListItems {
    userid: number, // partition key 
    imageid: string, // sort key
    imagename: string,            
    buket: string,
    imageurl: string
}