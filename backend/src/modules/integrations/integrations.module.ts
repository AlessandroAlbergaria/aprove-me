import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { PayableModule } from '../payable/payable.module';
import { AssignorModule } from '../assignor/assignor.module';

@Module({
  imports: [PayableModule, AssignorModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
})
export class IntegrationsModule {}
