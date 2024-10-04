import { Controller, Post, HttpStatus, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateClientDto } from '../cliente/dto/create_client.dto';
import { Client } from '../cliente/schemas/client.schema';
import { AuthService } from './auth.service';
import { UserLoginResponseDto } from './dto/login-user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthMessages } from './enums/auth-menssages.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: AuthMessages.REGISTER_SUMMARY })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: AuthMessages.REGISTER_CREATED,
    type: Client,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: AuthMessages.REGISTER_BAD_REQUEST,
  })
  async register(@Body() createClientDto: CreateClientDto) {
    return this.authService.register(createClientDto);
  }

  @Post('login')
  @ApiOperation({ summary: AuthMessages.LOGIN_SUMMARY })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthMessages.LOGIN_OK,
    type: UserLoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: AuthMessages.LOGIN_UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: AuthMessages.LOGIN_BAD_REQUEST,
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
