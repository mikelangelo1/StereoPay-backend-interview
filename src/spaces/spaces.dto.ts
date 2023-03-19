import { S3 } from 'aws-sdk';

export class UploadResult {
  sendData: S3.ManagedUpload.SendData;
  cdnUrl: string;
}

export class PreSignedUrlResult {
  preSignedUrl: string;
  contentType: string;
  cdnUrl: string;
  bucket: string;
  key: string;
}
