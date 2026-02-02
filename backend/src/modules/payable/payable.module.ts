import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { PayableRepository } from './payable.repository';

@Module({
  providers: [PayableService, PayableRepository],
  exports: [PayableService],
})
export class PayableModule {}
