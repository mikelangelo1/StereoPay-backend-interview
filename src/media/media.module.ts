import { SpacesModule } from '@/spaces/spaces.module';
import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
    controllers: [MediaController],
    providers: [MediaService],
    exports: [MediaService],
    imports: [SpacesModule]
})
export class MediaModule {}
