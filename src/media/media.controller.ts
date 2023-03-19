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
  ParseIntPipe,
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
import { CreateNewMediaRequest } from './media.dto';
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
  ): Promise<Media> {


    const newMedia =
      await this.mediaService.createNewMedia(
        data,
      );

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
    return newMedia;
  }

}
