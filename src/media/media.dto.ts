import { PreSignedUrlResult } from '@/spaces/spaces.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Media, MediaType, Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { type } from 'os';

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
