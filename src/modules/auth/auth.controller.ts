import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateClientDto } from '../cliente/dto/create_client.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Client } from '../cliente/schemas/client.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente registrado exitosamente.',
    type: Client,
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta, por favor verifica los datos.',
  })
  async register(@Body() createClientDto: CreateClientDto) {
    return this.authService.register(createClientDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de un cliente' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso.',
    type: String,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
