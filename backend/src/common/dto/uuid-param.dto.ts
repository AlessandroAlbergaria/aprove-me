import { IsUUID } from 'class-validator';

export class UuidParamDto {
  @IsUUID('4', { message: 'ID deve ser um UUID v4 válido' })
  id: string;
}
