import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'login deve ser uma string' })
  @IsNotEmpty({ message: 'login é obrigatório' })
  login: string;

  @IsString({ message: 'password deve ser uma string' })
  @IsNotEmpty({ message: 'password é obrigatório' })
  password: string;
}
