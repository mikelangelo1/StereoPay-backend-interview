/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PaginatedResult,
  PaginationContext,
} from '@/misc/pagination/pagination.dto';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';
import { CreateNewMediaRequest, SearchMediaResponse, UpdateMediaStatusRequest } from './media.dto';
import * as uuid from 'uuid';
import moment from 'moment';
import { PreSignedUrlResult } from '@/spaces/spaces.dto';
import { SpacesService } from '@/spaces/spaces.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly spacesService: SpacesService,
  ) {}

  public async createNewMedia(data: CreateNewMediaRequest): Promise<Media> {
    if (data.mediaData.length == 0) {
      throw new BadRequestException('Must provide media');
    }

    const curMoment = moment();
    const timestamp = curMoment.unix();

    const preSignedUrlResults: PreSignedUrlResult[] = [];

    for (let i = 0; i < data.mediaData.length; i++) {
      const contentType = data.mediaData[i].contentType;

      const filename = `${timestamp}_${uuid.v4()}`;
      const preSignedUrlRes = await this.spacesService.createPreSignedUrl(
        `media/${filename}`,
        contentType,
      );
      preSignedUrlResults.push(preSignedUrlRes);
    }
    const newMedia = await this.prismaService.media.create({
      data: {
        description: data.description,
        name: data.name,
        status: data.status,
        type: data.type,
        url: {
          createMany: {
            data: preSignedUrlResults.map((res, index) => {
              return {
                path: res.cdnUrl,
                type: data.mediaData[index].mediaType,
                s3Bucket: res.bucket,
                s3Key: res.key,
              };
            }),
          },
        },
      },
    });

    return newMedia;
  }

  public async getAllMedia(page: number, perPage: number) {
    const allMedia =
      await this.prismaService.media.findMany({
        take: page,
        skip: perPage
      });

      const totalCount = await this.prismaService.media.count();

    return {
      data: allMedia,
      total: totalCount
    };
  }


  public async getMedia(id: string) {
    const media =
      await this.prismaService.media.findUnique({
        where: {
          id: id,
        },
      });

    if (!media) {
      throw new NotFoundException('Invalid media');
    }

    return media;
  }

   /**
   * Search for media by title and description
   *
   * Supports Pagination
   */

   public async searchMedia(
    query: string,
  ): Promise<SearchMediaResponse> {
    // TODO: Use a better searching approach to improve performance

    const filter: Prisma.MediaWhereInput = {
      OR: [
        {
          name: {
            startsWith: query,
            contains: query
          },
        },
        {
          description: {
            startsWith: query,
            contains: query
          },
        },
      ],
    };

    const media =
      await this.prismaService.media.findMany({
        where: filter,
      });

    const totalCount = await this.prismaService.media.count({
      where: filter,
    });

    return {
      data: media,
      total: totalCount,
    };
  }




  /**
   * Update media status
   *
   * Return media
   */
  public async updateMediaStatus(
    id: string,
    data: UpdateMediaStatusRequest,
  ): Promise<Media> {
    return await this.prismaService.media.update({
      where: {
        id: id,
      },
      data: {
        status: data.status,
      },
    });
  }

  /**
   * Delete media
   *
   * Return null
   */
  public async deleteMedia(id: string) {
    return await this.prismaService.media.delete({
      where: {
        id: id,
      },
    });
  }
}
