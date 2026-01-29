import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserUseCase } from './register.use-case';
import { IUserRepository } from '../../domain/user.repository.interface';

const mockUserRepo = {
  findByEmail: jest.fn(),
  save: jest.fn(),
};

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: IUserRepository,
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test',
    });

    expect(result.isSuccess).toBe(true);
    expect(mockUserRepo.save).toHaveBeenCalled();
  });

  it('should fail if user already exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com' });

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('User already exists');
    expect(mockUserRepo.save).not.toHaveBeenCalled();
  });
});
