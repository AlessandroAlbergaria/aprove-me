import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto } from './dto';
import { Public } from './decorators/public.decorator';

@Controller('integrations')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('auth')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }
}
