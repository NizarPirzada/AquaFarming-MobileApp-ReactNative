import S3 from 'aws-sdk/clients/s3';
import {accessKeyId,secretAccessKey,Bucket,signatureVersion} from '../../aws.json';
export const s3bucket =new S3({
        accessKeyId:     accessKeyId,
        secretAccessKey: secretAccessKey,
        Bucket:          Bucket,
        signatureVersion: signatureVersion,
    });

    