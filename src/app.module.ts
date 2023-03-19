import { Module } from '@nestjs/common';
import { appConfig } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logging/loggers/nestLogger/logger.module';
import { MediaModule } from './media/media.module';
import { PrismaModule } from './prisma/prisma.module';
import { SpacesModule } from './spaces/spaces.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

@Module({
  imports: [
    LoggerModule.register(appConfig.logging.options),
    PrismaModule,
    SpacesModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static'),
      renderPath: 'static/*',
    }),
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
