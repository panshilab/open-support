import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  MediaAssetIdParamDto,
  MediaListQueryDto,
  UploadMediaMetadataDto,
  type MediaListQuery,
  type UploadMediaMetadataInput,
} from '@open-support/schemas/media';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SessionGuard } from '../auth/session.guard';
import type { SessionUser } from '../auth/session.service';
import { MediaService } from './media.service';

@Controller('media')
@UseGuards(SessionGuard, RolesGuard)
@Roles('admin', 'support_agent')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get()
  list(@Query() query: MediaListQueryDto) {
    return this.media.list(query as MediaListQuery);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @CurrentUser() user: SessionUser,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: UploadMediaMetadataDto,
  ) {
    return this.media.upload(user, file, body as UploadMediaMetadataInput);
  }

  @Delete(':mediaId')
  delete(@Param() params: MediaAssetIdParamDto) {
    return this.media.delete(params.mediaId);
  }
}
