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
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ClientsService } from './cliente.service';
import { CreateClientDto } from './dto/create_client.dto';
import { Client } from './schemas/client.schema';
import { UpdateClientDto } from './dto/update_client';
import { ClientMessages } from './enums/client-messages.enum';
import { ClientOperationSummaries } from './enums/client.operation-summaries';
@ApiTags('Clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: ClientOperationSummaries.CREATE_CLIENT })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ClientMessages.CLIENT_CREATED_SUCCESSFULLY,
    type: Client,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ClientMessages.BAD_REQUEST,
  })
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return await this.clientsService.create(createClientDto);
  }

  @Get(':id')
  @ApiOperation({ summary: ClientOperationSummaries.FIND_CLIENT_BY_ID })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ClientMessages.CLIENT_FOUND,
    type: Client,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ClientMessages.CLIENT_NOT_FOUND,
  })
  async findOne(@Param('id') id: string): Promise<Client> {
    return await this.clientsService.findOne(id);
  }

  @Post('by/email')
  @ApiOperation({ summary: ClientOperationSummaries.FIND_CLIENTS_BY_EMAIL })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ClientMessages.CLIENT_BY_EMAIL_FOUND,
    type: [Client],
  })
  async findAll(@Query('email') email: string): Promise<Client> {
    return await this.clientsService.findOneByEmail(email);
  }

  @Get()
  @ApiOperation({ summary: ClientOperationSummaries.FIND_ALL_CLIENTS })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ClientMessages.ALL_CLIENTS_LIST,
    type: [Client],
  })
  async findAllClients(): Promise<Client[]> {
    return await this.clientsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: ClientOperationSummaries.SEARCH_CLIENTS_BY_NAME })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ClientMessages.CLIENTS_FOUND,
    type: [Client],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ClientMessages.CLIENT_NOT_FOUND,
  })
  async search(@Query('name') name: string): Promise<Client[]> {
    return await this.clientsService.findByName(name);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: ClientOperationSummaries.UPDATE_CLIENT_PASSWORD })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ClientMessages.PASSWORD_UPDATED_SUCCESSFULLY,
    type: Client,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ClientMessages.CLIENT_NOT_FOUND,
  })
  async updatePassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ): Promise<Client> {
    return await this.clientsService.updatePassword(id, newPassword);
  }

  @Get('paginate')
  @ApiOperation({ summary: ClientOperationSummaries.PAGINATE_CLIENTS })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ClientMessages.CLIENTS_PAGINATED,
    type: [Client],
  })
  async paginate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ clients: Client[]; total: number }> {
    return await this.clientsService.paginate(page, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: ClientOperationSummaries.UPDATE_CLIENT_INFO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: ClientMessages.CLIENT_UPDATED,
    type: Client,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ClientMessages.CLIENT_NOT_FOUND,
  })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return await this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: ClientOperationSummaries.DELETE_CLIENT })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: ClientMessages.CLIENT_DELETED_SUCCESSFULLY,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ClientMessages.CLIENT_NOT_FOUND,
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.clientsService.remove(id);
  }
}
