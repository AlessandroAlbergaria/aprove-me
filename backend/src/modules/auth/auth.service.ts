import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const { login, password } = loginDto;

    if (login !== 'aprovame' || password !== 'aprovame') {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: login, username: login };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(username: string): Promise<any> {
    if (username === 'aprovame') {
      return { username: 'aprovame' };
    }
    return null;
  }
}
