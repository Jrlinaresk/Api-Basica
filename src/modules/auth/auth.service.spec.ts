// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ClientsService } from '../cliente/cliente.service';

const mockClient = {
  _id: '1',
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: 'hashedPassword',
  toObject: jest.fn().mockReturnValue({
    _id: '1',
    name: 'John Doe',
    email: 'johndoe@example.com',
  }),
};

const mockClientsService = {
  findByEmail: jest.fn().mockResolvedValue(mockClient),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user and return user data without password', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await service.validateUser(
      'johndoe@example.com',
      'password123',
    );
    expect(result).toEqual({
      _id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
    });
  });

  it('should return null if password is incorrect', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const result = await service.validateUser(
      'johndoe@example.com',
      'wrongpassword',
    );
    expect(result).toBeNull();
  });

  it('should return a JWT token on login', async () => {
    const result = await service.login(mockClient);
    expect(result).toEqual({ access_token: 'token' });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: mockClient.email,
      sub: mockClient._id,
    });
  });
});
