import { authService } from '../auth.service';
import { apiClient } from '../client';
import type { LoginCredentials, AuthResponse, CreateUserDto } from '@/types';

jest.mock('../client');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const credentials: LoginCredentials = {
        login: 'testuser',
        password: 'password123',
      };

      const mockResponse: AuthResponse = {
        access_token: 'mock-jwt-token',
      };

      mockApiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await authService.login(credentials);

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        login: 'newuser',
        password: 'password123',
      };

      const mockResponse = {
        id: '123',
        login: 'newuser',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockApiClient.post.mockResolvedValue({ data: mockResponse });

      const result = await authService.register(createUserDto);

      expect(mockApiClient.post).toHaveBeenCalledWith('/users', createUserDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
