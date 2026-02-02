import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockUsersService = {
    findByLogin: jest.fn(),
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockUser = {
      id: 'user-uuid-123',
      login: 'testuser',
      password: 'hashedPassword123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return access token with valid credentials', async () => {
      const loginDto = { login: 'testuser', password: 'password123' };
      const mockToken = 'mock.jwt.token';

      mockUsersService.findByLogin.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: mockToken });
      expect(mockUsersService.findByLogin).toHaveBeenCalledWith('testuser');
      expect(mockUsersService.validatePassword).toHaveBeenCalledWith(
        'password123',
        'hashedPassword123',
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-uuid-123',
        username: 'testuser',
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const loginDto = { login: 'nonexistent', password: 'password123' };

      mockUsersService.findByLogin.mockRejectedValue(
        new NotFoundException('Usuário não encontrado'),
      );

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Credenciais inválidas',
      );
      expect(mockUsersService.validatePassword).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with invalid password', async () => {
      const loginDto = { login: 'testuser', password: 'wrongpassword' };

      mockUsersService.findByLogin.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Credenciais inválidas',
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user object for valid userId', async () => {
      const mockUser = {
        id: 'user-uuid-123',
        login: 'testuser',
        password: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findByLogin.mockResolvedValue(mockUser);

      const result = await service.validateUser('testuser');

      expect(result).toEqual({ id: 'user-uuid-123', username: 'testuser' });
      expect(mockUsersService.findByLogin).toHaveBeenCalledWith('testuser');
    });

    it('should return null when user not found', async () => {
      mockUsersService.findByLogin.mockRejectedValue(
        new NotFoundException('Usuário não encontrado'),
      );

      const result = await service.validateUser('nonexistent');

      expect(result).toBeNull();
    });
  });
});
