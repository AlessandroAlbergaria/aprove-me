import { Module } from '@nestjs/common';
import { AssignorService } from './assignor.service';

@Module({
  providers: [AssignorService],
  exports: [AssignorService],
})
export class AssignorModule {}
