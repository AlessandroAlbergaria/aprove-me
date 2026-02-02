import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { PrismaModule } from './database';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { PayableModule } from './modules/payable/payable.module';
import { AssignorModule } from './modules/assignor/assignor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    IntegrationsModule,
    PayableModule,
    AssignorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
