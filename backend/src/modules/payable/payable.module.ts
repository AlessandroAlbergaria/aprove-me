import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';

@Module({
  providers: [PayableService],
  exports: [PayableService],
})
export class PayableModule {}
