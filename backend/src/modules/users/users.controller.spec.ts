import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      login: 'testuser',
      password: 'password123',
    };

    const createdUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      login: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user', async () => {
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if login already exists', async () => {
      mockUsersService.create.mockRejectedValue(
        new ConflictException('Login já está em uso'),
      );

      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
