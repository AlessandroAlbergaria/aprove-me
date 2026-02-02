import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { PayableModule } from '../payable/payable.module';
import { AssignorModule } from '../assignor/assignor.module';
import { QueueModule } from '../../queue';

@Module({
  imports: [PayableModule, AssignorModule, QueueModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
})
export class IntegrationsModule {}
