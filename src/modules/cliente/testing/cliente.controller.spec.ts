// src/clients/clients.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { ClientsController } from '../cliente.controller';
import { ClientsService } from '../cliente.service';
import { CreateClientDto } from '../dto/create_client.dto';

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

const mockClientsService = {
  create: jest.fn().mockResolvedValue(mockClient),
  findAll: jest.fn().mockResolvedValue([mockClient]),
  update: jest.fn().mockResolvedValue(mockClient),
  remove: jest.fn().mockResolvedValue(mockClient),
  findOneByEmail: jest.fn().mockResolvedValue(mockClient),
};

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const createClientDto: CreateClientDto = {
        name: 'Johsan Doe',
        email: 'johnssdoe@example.com',
        phone: '123156289',
        password: 'pL@assword123',
      };

      const result = await controller.create(createClientDto);
      expect(result).toEqual(mockClient);
      expect(service.create).toHaveBeenCalledWith(createClientDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const result = await controller.findAllClients();
      expect(result).toEqual([mockClient]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const updateData = { name: 'John Updated' };
      const result = await controller.update('1', updateData);
      expect(result).toEqual(mockClient);
      expect(service.update).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('remove', () => {
    it('should remove a client', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual(mockClient);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
