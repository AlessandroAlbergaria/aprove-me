import { Module } from '@nestjs/common';
import { AssignorService } from './assignor.service';
import { AssignorRepository } from './assignor.repository';

@Module({
  providers: [AssignorService, AssignorRepository],
  exports: [AssignorService],
})
export class AssignorModule {}
