import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token with valid credentials', async () => {
      const loginDto = { login: 'aprovame', password: 'aprovame' };
      const mockToken = 'mock.jwt.token';

      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: mockToken });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 'aprovame',
        username: 'aprovame',
      });
    });

    it('should throw UnauthorizedException with invalid login', async () => {
      const loginDto = { login: 'wrong', password: 'aprovame' };

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Credenciais inválidas',
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const loginDto = { login: 'aprovame', password: 'wrong' };

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Credenciais inválidas',
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with both credentials invalid', async () => {
      const loginDto = { login: 'wrong', password: 'wrong' };

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user object for valid username', async () => {
      const result = await service.validateUser('aprovame');

      expect(result).toEqual({ username: 'aprovame' });
    });

    it('should return null for invalid username', async () => {
      const result = await service.validateUser('invalid');

      expect(result).toBeNull();
    });
  });
});
