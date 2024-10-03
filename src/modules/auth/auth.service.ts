// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ClientsService } from '../cliente/cliente.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const client = await this.clientsService.findByEmail(email);
    if (client && (await bcrypt.compare(pass, client.password))) {
      // Devuelve solo la información relevante del usuario sin la contraseña
      return { ...client.toObject(), password: undefined };
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createClientDto) {
    return this.clientsService.create(createClientDto);
  }
}
