import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'login deve ser uma string' })
  @IsNotEmpty({ message: 'login é obrigatório' })
  login: string;

  @IsString({ message: 'password deve ser uma string' })
  @IsNotEmpty({ message: 'password é obrigatório' })
  @MinLength(6, { message: 'password deve ter no mínimo 6 caracteres' })
  password: string;
}
