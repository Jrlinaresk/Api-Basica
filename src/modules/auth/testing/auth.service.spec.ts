import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';
import { ClientsService } from '../../cliente/cliente.service';

const mockClient = {
  _id: '66ff5508dbf3686484eaba87',
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: 'pL@assword123',
  toObject: jest.fn().mockReturnValue({
    _id: '66ff5508dbf3686484eaba87',
    name: 'John Doe',
    email: 'johndoe@example.com',
  }),
};

const mockLoginUserDto = {
  email: 'johndoe@example.com',
  password: 'pL@assword123',
};

const mockClientsService = {
  findOneByEmail: jest.fn().mockResolvedValue(mockClient.email),
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
      mockLoginUserDto.email,
      mockLoginUserDto.password,
    );
    expect(result).toEqual({
      _id: '66ff5508dbf3686484eaba87',
      name: 'John Doe',
      email: 'johndoe@example.com',
    });
  });

  it('should return null if password is incorrect', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const result = await service.validateUser(
      mockLoginUserDto.email,
      mockLoginUserDto.password,
    );
    expect(result).toBeNull();
  });

  it('should return a JWT token on login', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(service, 'validateUser').mockResolvedValue(mockClient);

    const result = await service.login(mockLoginUserDto);

    expect(result).toEqual({ access_token: result.access_token });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: mockLoginUserDto.email,
    });
  });
});
