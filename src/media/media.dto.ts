import { PreSignedUrlResult } from '@/spaces/spaces.dto';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType, Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';

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
