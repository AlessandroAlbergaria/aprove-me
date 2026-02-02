import {
  IsUUID,
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignorDto {
  @ApiProperty({
    description: 'Identificação única do cedente (UUID v4)',
    example: '987fcdeb-51a2-43d7-b123-123456789abc',
    format: 'uuid',
  })
  @IsUUID('4', { message: 'id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'id é obrigatório' })
  id: string;

  @ApiProperty({
    description: 'Documento CPF ou CNPJ do cedente',
    example: '12345678901',
    maxLength: 30,
  })
  @IsString({ message: 'document deve ser uma string' })
  @MaxLength(30, { message: 'document não pode exceder 30 caracteres' })
  @IsNotEmpty({ message: 'document é obrigatório' })
  document: string;

  @ApiProperty({
    description: 'Email do cedente',
    example: 'contato@empresa.com.br',
    format: 'email',
    maxLength: 140,
  })
  @IsEmail({}, { message: 'email deve ser um endereço de email válido' })
  @MaxLength(140, { message: 'email não pode exceder 140 caracteres' })
  @IsNotEmpty({ message: 'email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Telefone do cedente',
    example: '(11) 98765-4321',
    maxLength: 20,
  })
  @IsString({ message: 'phone deve ser uma string' })
  @MaxLength(20, { message: 'phone não pode exceder 20 caracteres' })
  @IsNotEmpty({ message: 'phone é obrigatório' })
  phone: string;

  @ApiProperty({
    description: 'Nome ou razão social do cedente',
    example: 'Empresa LTDA',
    maxLength: 140,
  })
  @IsString({ message: 'name deve ser uma string' })
  @MaxLength(140, { message: 'name não pode exceder 140 caracteres' })
  @IsNotEmpty({ message: 'name é obrigatório' })
  name: string;
}
