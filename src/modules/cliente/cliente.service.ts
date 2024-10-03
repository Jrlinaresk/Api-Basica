import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './schemas/client.schema';
import * as bcrypt from 'bcryptjs';
import { CreateClientDto } from './dto/create_client.dto';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const hashedPassword = await bcrypt.hash(createClientDto.password, 10);
    const createdClient = new this.clientModel({
      ...createClientDto,
      password: hashedPassword,
    });
    return createdClient.save();
  }

  async findAll(email?: string): Promise<Client[]> {
    if (email) {
      return this.clientModel.find({ email }).exec();
    }
    return this.clientModel.find().exec();
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.clientModel.findOne({ email }).exec();
  }

  async update(
    id: string,
    updateData: Partial<CreateClientDto>,
  ): Promise<Client> {
    const client = await this.clientModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Client not found');
    }
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findById(id).exec();
    if (!client) {
      throw new NotFoundException('Client not found');
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
      throw new NotFoundException('Client not found');
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
