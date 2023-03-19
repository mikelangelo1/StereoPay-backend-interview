/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestLogger } from '@/logging/loggers/nestLogger/nestLogger';
import { Pagination } from '@/misc/pagination/pagination.decorators';
import { paginationUtils } from '@/misc/pagination/pagination.utils';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { Media } from '@prisma/client';
import { Request, Response } from 'express';
import _ from 'lodash';
import { MediaConstants } from './media.constant';
import {
  CreateNewMediaRequest,
  MediaRespone,
  SearchMediaResponse,
  UpdateMediaStatusRequest,
  ResponseStatus,
} from './media.dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly nestLogger: NestLogger,
    private readonly mediaService: MediaService,
  ) {
    nestLogger.setOrigin(MediaController.name);
  }

  /**
   * @description Create a new media object
   *
   * @returns a new media object
   */
  @Post('add-new')
  async createNewMedia(
    @Body() data: CreateNewMediaRequest,
    @Req() req: Request,
  ): Promise<MediaRespone<Media>> {
    const newMedia = await this.mediaService.createNewMedia(data);

    this.nestLogger.info(
      'new-media-created-success',
      'New media created successfully',
      req.context,
      {
        properties: {
          newMedia: newMedia.id,
        },
      },
    );
    return {
      data: newMedia,
      message: 'New media created successfully',
      status: ResponseStatus.SUCCESS,
    };
  }

  /**
   * @description Fetch a paginated list of existing media objects
   *
   * @returns  media paginated media
   */

  @Pagination({
    maxTake: 20,
  })
  @Get('media')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ) {
    const result = await this.mediaService.getAllMedia(page, perPage);
    const skip = page ?? 0;
    const take = perPage ?? 20;

    
    return paginationUtils.sendPaginatedResponse(res, result, skip, take);
  }

  /**
   * @description Fetch a single media by id
   *
   * @returns  media paginated media
   */

  @ApiParam({
    name: 'id',
    description: 'Media ID',
  })
  @Get('media/:id')
  async getMedia(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<MediaRespone<Media>> {
    if (_.isNil(id)) {
      throw new BadRequestException('Invalid Media');
    }
    const media = await this.prismaService.media.findUnique({
      where: {
        id: id,
      },
    });

    if (!media) {
      this.nestLogger.error(
        'attempt-to-get-media',
        'Invalid media',
        req.context,
        {
          properties: {
            mediaId: id,
          },
        },
      );
      throw new BadRequestException('Invalid Media');
    }

    const mediaInfo = await this.mediaService.getMedia(id);

    return {
      data: mediaInfo,
      message: 'Successfully retrieved media info',
      status: ResponseStatus.SUCCESS,
    }
  }

  /**
   * @description Search media by title and description
   *
   * @returns  media paginated media
   */

  @Get('search')
  async searchMedia(
    @Req() req: Request,
    @Query('query') query: string,
  ): Promise<MediaRespone<SearchMediaResponse>> {
    const media = await this.mediaService.searchMedia(query);

    return {
      data: media,
      message: 'Search query successful',
      status: ResponseStatus.SUCCESS,
    };
  }

  /**
   * @description Update an existing media by id.
   *
   * @returns  media paginated media
   */

  @ApiParam({
    name: 'id',
    description: 'Media ID',
  })
  @Patch('media/:id')
  async updateMedia(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() data: UpdateMediaStatusRequest,
  ): Promise<MediaRespone<Media>> {
    if (_.isNil(id)) {
      throw new BadRequestException('Invalid Media ID');
    }

    const media = await this.prismaService.media.findUnique({
      where: {
        id: id,
      },
    });

    if (!media) {
      this.nestLogger.error(
        'attempt-to-update-media-status',
        'Invalid Media',
        req.context,
        {
          properties: {
            mediaId: id,
          },
        },
      );
      throw new BadRequestException('Invalid Media');
    }

    const updatedMedia =  await this.mediaService.updateMediaStatus(id, data);

    return {
      data: updatedMedia,
      message: 'Updated media status successfully',
      status: ResponseStatus.SUCCESS,
    }
  }

  /**
   * @description Soft delete a media item by id
   *
   * @returns  null
   */

  @ApiParam({
    name: 'id',
    description: 'Media ID',
  })
  @Delete('media/:id')
  async deleteMedia(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Req() req: Request,
  ): Promise<MediaRespone<Media>> {
    if (_.isNil(id)) {
      throw new BadRequestException('Invalid Media');
    }

    const media = await this.prismaService.media.findUnique({
      where: {
        id: id,
      },
    });

    if (!media) {
      this.nestLogger.error(
        'attempt-to-delete-media',
        'Invalid Media',
        req.context,
        {
          properties: {
            mediaId: id,
          },
        },
      );
      throw new BadRequestException('Invalid Media');
    }

    const deletedMedia = await this.mediaService.deleteMedia(id);

    return {
      data: deletedMedia,
      message: 'Successfully deleted media',
      status: ResponseStatus.SUCCESS,
    }
  }
}
