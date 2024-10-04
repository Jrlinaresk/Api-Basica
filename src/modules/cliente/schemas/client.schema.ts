import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
@Schema()
export class Client extends Document {
  @ApiProperty({
    description: 'El nombre del cliente.',
    type: String,
    minLength: 3,
    maxLength: 30,
    example: 'Johsan Doe',
  })
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 30,
  })
  name: string;

  @ApiProperty({
    description: 'El correo electrónico del cliente. Debe ser único.',
    type: String,
    minLength: 5,
    maxLength: 150,
    example: 'johnssdoe@example.com',
  })
  @Prop({
    required: true,
    unique: true,
    index: 1,
    minlength: 5,
    maxlength: 150,
    trim: true,
    lowercase: true,
  })
  email: string;

  @ApiProperty({
    description: 'El número de teléfono del cliente. Debe ser único.',
    type: String,
    example: '123156289',
  })
  @Prop({
    required: true,
    unique: true,
  })
  phone: string;

  @ApiProperty({
    description:
      'La contraseña del cliente. Debe contener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.',
    type: String,
    example: 'password123',
  })
  @Prop({
    required: true,
    minlength: 8,
  })
  password: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
