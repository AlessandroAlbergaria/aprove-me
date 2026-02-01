import { PayableResponseDto } from '../../payable/dto';
import { AssignorResponseDto } from '../../assignor/dto';

export class IntegrationResponseDto {
  payable: PayableResponseDto;
  assignor: AssignorResponseDto;
}
