import { PrismaFindArgs } from '@/misc/types/helperTypes';
import { PreSignedUrlResult } from '@/spaces/spaces.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Media, MediaType, Prisma, Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { type } from 'os';
import { MediaConstants } from './media.constant';

export class CreateNewMediaRequest {
  @ApiProperty({
    enum: Object.values(MediaType),
  })
  @IsEnum(MediaType)
  type: MediaType;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @ValidateNested()
  mediaData: CreateNewMediaData[];

  @ApiProperty({
    enum: Object.values(Status),
  })
  @IsEnum(Status)
  status: Status;
}

export class CreateNewMediaData {
  @ApiProperty({
    enum: Object.values(MediaType),
  })
  @IsEnum(MediaType)
  mediaType: MediaType;

  @IsNotEmpty()
  contentType: string;
}

export class CreateNewMediaResponse {
  preSignedUrls: PreSignedUrlResult[];
}

export class UpdateMediaStatusRequest {
  @ApiProperty({
    enum: Object.values(Status),
  })
  @IsEnum(Status)
  status: Status;
}

export class SearchMediaResponse {
  data: Media[];
  total: number;
}

export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type MediaRespone<T> = {
  status: ResponseStatus;
  message: string;
  data: T[] | T;
};

export class MediaUrlDto {
  id: number;
  mediaId: number | null;

  @ApiProperty({
    enum: Object.values(MediaType),
  })
  type: MediaType;

  path: string;
  s3Bucket: string | null;
  s3Key: string | null;
  createdAt: Date;
  updatedAt: Date;
}

