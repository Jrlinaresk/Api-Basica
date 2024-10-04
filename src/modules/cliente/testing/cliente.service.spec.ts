import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { ClientsService } from '../cliente.service';
import { Client } from '../schemas/client.schema';

const mockClient = {
  _id: '66ff5508dbf3686484eaba87',
  name: 'Johsan Doe',
  email: 'johnssdoe@example.com',
  phone: '123156289',
  password: 'pL@assword123',
  toObject: jest.fn().mockReturnValue({
    _id: '66ff5508dbf3686484eaba87',
    name: 'Johsan Doe',
    email: 'johnssdoe@example.com',
  }),
};

const mockClientModel = {
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockClient]),
  }),
  findOne: jest.fn().mockResolvedValue(mockClient),
  findByIdAndUpdate: jest.fn().mockImplementation((id, update) => ({
    ...mockClient,
    ...update,
    toObject: jest.fn().mockReturnValue({ ...mockClient, ...update }),
  })),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockClient),
  constructor: jest.fn().mockReturnThis(),
  create: jest.fn().mockResolvedValue(mockClient),
  save: jest.fn().mockResolvedValue(mockClient),
  exec: jest.fn(),
};

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getModelToken(Client.name),
          useValue: mockClientModel,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client and hash the password', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const newClient = await service.create({
        name: 'Johsan Doe',
        email: 'johnssdoe@example.com',
        phone: '123156289',
        password: 'password123',
      });

      expect(newClient.password).toEqual('hashedPassword');
      expect(mockClientModel.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const clients = await service.findAll();
      expect(clients).toEqual([mockClient]);
      expect(mockClientModel.find).toHaveBeenCalled();
      expect(mockClientModel.find().exec).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const updatedClient = await service.update('1', { name: 'John Updated' });
      expect(updatedClient.name).toEqual('John Updated');
      expect(mockClientModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a client', async () => {
      await service.remove('1');
      expect(mockClientModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
