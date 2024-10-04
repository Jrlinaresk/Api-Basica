// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ClientsService } from '../cliente/cliente.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UserLoginResponseDto } from './dto/login-user-response.dto';
import { Client } from '../cliente/schemas/client.schema';
import { CreateClientDto } from '../cliente/dto/create_client.dto';
import { AuthMessages } from './enums/auth-menssages.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<LoginUserDto> {
    const client = await this.clientsService.findOneByEmail(email);
    if (client && (await bcrypt.compare(pass, client.password))) {
      return { ...client.toObject(), password: undefined };
    }
    return null;
  }

  async login(user: LoginUserDto): Promise<UserLoginResponseDto> {
    const validatedUser = await this.validateUser(user.email, user.password);

    if (!validatedUser) {
      throw new UnauthorizedException(AuthMessages.LOGIN_UNAUTHORIZED);
    }

    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }
}
