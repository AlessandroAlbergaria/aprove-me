import {
  IsUUID,
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateAssignorDto {
  @IsUUID('4', { message: 'id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'id é obrigatório' })
  id: string;

  @IsString({ message: 'document deve ser uma string' })
  @MaxLength(30, { message: 'document não pode exceder 30 caracteres' })
  @IsNotEmpty({ message: 'document é obrigatório' })
  document: string;

  @IsEmail({}, { message: 'email deve ser um endereço de email válido' })
  @MaxLength(140, { message: 'email não pode exceder 140 caracteres' })
  @IsNotEmpty({ message: 'email é obrigatório' })
  email: string;

  @IsString({ message: 'phone deve ser uma string' })
  @MaxLength(20, { message: 'phone não pode exceder 20 caracteres' })
  @IsNotEmpty({ message: 'phone é obrigatório' })
  phone: string;

  @IsString({ message: 'name deve ser uma string' })
  @MaxLength(140, { message: 'name não pode exceder 140 caracteres' })
  @IsNotEmpty({ message: 'name é obrigatório' })
  name: string;
}
