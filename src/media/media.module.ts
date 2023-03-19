import { SpacesModule } from '@/spaces/spaces.module';
import { Module } from '@nestjs/common';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [SpacesModule]
})
export class MediaModule {}
