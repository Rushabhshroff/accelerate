import AWS from 'aws-sdk'
import { s3_access_id, s3_access_key } from '../config.json'
export function S3() {
    return new AWS.S3({
        apiVersion: '2006-03-01',
        credentials: {
            accessKeyId: s3_access_id,
            secretAccessKey: s3_access_key
        }
    })
}
export const ImageBucket = 'accelerate-images'