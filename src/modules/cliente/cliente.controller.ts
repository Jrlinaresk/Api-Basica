import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientsService } from './cliente.service';
import { CreateClientDto } from './dto/create_client.dto';
import { Client } from './schemas/client.schema';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado exitosamente.',
    type: Client,
  })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado.',
    type: Client,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes.',
    type: [Client],
  })
  async findAll(@Query('email') email?: string) {
    return this.clientsService.findAll(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiOperation({ summary: 'Buscar clientes por nombre' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes encontrados.',
    type: [Client],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron clientes con ese nombre.',
  })
  async search(@Query('name') name: string) {
    return this.clientsService.findByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  @ApiOperation({ summary: 'Actualizar la contraseña de un cliente' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente.',
    type: Client,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async updatePassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.clientsService.updatePassword(id, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('paginate')
  @ApiOperation({ summary: 'Paginación de clientes' })
  @ApiResponse({
    status: 200,
    description: 'Clientes paginados.',
    type: [Client],
  })
  async paginate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.clientsService.paginate(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar información de un cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado.',
    type: Client,
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: Partial<CreateClientDto>,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiResponse({ status: 204, description: 'Cliente eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  async remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
