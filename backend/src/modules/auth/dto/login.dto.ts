import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Login do usuário',
    example: 'aprovame',
  })
  @IsString({ message: 'login deve ser uma string' })
  @IsNotEmpty({ message: 'login é obrigatório' })
  login: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'aprovame',
  })
  @IsString({ message: 'password deve ser uma string' })
  @IsNotEmpty({ message: 'password é obrigatório' })
  password: string;
}
