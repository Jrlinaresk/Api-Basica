import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Client } from './schemas/client.schema';
import * as bcrypt from 'bcryptjs';
import { CreateClientDto } from './dto/create_client.dto';
import { UpdateClientDto } from './dto/update_client';
import { ClientMessages } from './enums/client-messages.enum';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const existingClient = await this.findOneByEmail(createClientDto.email);
    if (existingClient) {
      throw new ConflictException(ClientMessages.EMAIL_ALREADY_REGISTERED);
    }

    const findPhone = await this.clientModel.findOne({
      phone: createClientDto.phone,
    });
    if (findPhone) {
      throw new ConflictException(ClientMessages.PHONE_ALREADY_REGISTERED);
    }

    const hashedPassword = await bcrypt.hash(createClientDto.password, 10);
    const createdClient = await this.clientModel.create({
      ...createClientDto,
      password: hashedPassword,
    });
    return createdClient;
  }

  async findAll(): Promise<Client[]> {
    try {
      const clients = await this.clientModel.find({}).exec();
      return clients;
    } catch (error) {
      throw new InternalServerErrorException(
        ClientMessages.CLIENTS_RETRIEVAL_ERROR + error,
      );
    }
  }

  async findOneByEmail(email: string): Promise<Client | null> {
    return this.clientModel.findOne({ email }).exec();
  }

  async update(id: string, updateData: UpdateClientDto): Promise<Client> {
    if (updateData.email) {
      const existingClient = await this.clientModel.findOne({
        email: updateData.email,
      });
      if (existingClient && existingClient.id !== id) {
        throw new ConflictException(ClientMessages.EMAIL_IN_USE);
      }
    }

    const client = await this.clientModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!client) {
      throw new NotFoundException(ClientMessages.CLIENT_NOT_FOUND);
    }
    return client;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(ClientMessages.INVALID_CLIENT_ID);
    }

    let result;
    try {
      result = await this.clientModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        ClientMessages.DELETE_CLIENT_ERROR + error,
      );
    }

    if (!result) {
      throw new NotFoundException(ClientMessages.CLIENT_NOT_FOUND);
    }
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id).exec();
    if (!client) {
      throw new NotFoundException(ClientMessages.CLIENT_NOT_FOUND);
    }
    return client;
  }

  async findByName(name: string): Promise<Client[]> {
    return this.clientModel
      .find({ name: { $regex: name, $options: 'i' } })
      .exec();
  }

  async updatePassword(id: string, newPassword: string): Promise<Client> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedClient = await this.clientModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );
    if (!updatedClient) {
      throw new NotFoundException(ClientMessages.CLIENT_NOT_FOUND);
    }
    return updatedClient;
  }

  async paginate(
    page: number,
    limit: number,
  ): Promise<{ clients: Client[]; total: number }> {
    const skip = (page - 1) * limit;
    const clients = await this.clientModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.clientModel.countDocuments().exec();
    return { clients, total };
  }
}
