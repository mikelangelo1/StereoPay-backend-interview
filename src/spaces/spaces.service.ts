import { Injectable } from '@nestjs/common';
import S3 from 'aws-sdk/clients/s3';
import { appConfig } from '../app.config';
import _ from 'lodash';
import fs from 'fs/promises';
import { PreSignedUrlResult, UploadResult } from './spaces.dto';

@Injectable()
export class SpacesService {
  private _s3: S3;
  get s3() {
    return this._s3;
  }

  constructor() {
    this._s3 = new S3({
      endpoint: appConfig.spaces.originEndpoint,
      accessKeyId: appConfig.spaces.accessKey,
      secretAccessKey: appConfig.spaces.secretKey,
      signatureVersion: 'v4',
    });
  }

  async uploadFile(
    key: string,
    fileBuffer: Buffer,
    options?: S3.ManagedUpload.ManagedUploadOptions,
    bucket = appConfig.spaces.defaultBucket,
  ): Promise<UploadResult> {
    const defaultOptions: S3.ManagedUpload.ManagedUploadOptions = {
      queueSize: 10,
    };

    const mergedOptions = _.merge(defaultOptions, options);
    const sendData = await this.s3
      .upload(
        {
          Bucket: bucket,
          ACL: 'public-read',
          Key: key,
          Body: fileBuffer,
        },
        mergedOptions,
      )
      .promise();

    return {
      sendData,
      cdnUrl: `https://${bucket}.${appConfig.spaces.cdnEndpoint}/${key}`,
    };
  }

  async uploadFileFromPath(
    key: string,
    filePath: string,
    options?: S3.ManagedUpload.ManagedUploadOptions,
  ) {
    const file = await fs.readFile(filePath);
    return await this.uploadFile(key, file, options);
  }

  async createPreSignedUrl(
    key: string,
    contentType: string,
    bucket = appConfig.spaces.defaultBucket,
  ): Promise<PreSignedUrlResult> {
    const preSignedUrl = await this.s3.getSignedUrlPromise('putObject', {
      Bucket: bucket,
      ACL: 'public-read',
      Key: key,
      ContentType: contentType,
      Expires: 360,
    });

    return {
      preSignedUrl,
      contentType,
      cdnUrl: `https://${bucket}.${appConfig.spaces.cdnEndpoint}/${key}`,
      bucket,
      key,
    };
  }

  async doesObjectExist(key: string, bucket = appConfig.spaces.defaultBucket) {
    const res = await this.s3
      .listObjectsV2({
        Bucket: bucket,
        Prefix: key,
      })
      .promise();
    return !!res.Contents?.length;
  }
}
