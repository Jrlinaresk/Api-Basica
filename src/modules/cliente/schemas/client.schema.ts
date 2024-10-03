import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger'; // Importa ApiProperty

@Schema()
export class Client extends Document {
  @ApiProperty({
    description: 'El nombre del cliente.',
    type: String,
    minLength: 3,
    maxLength: 30,
  })
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 30,
    validate: {
      validator: (value: string) => /^[A-Za-zÀ-ÿ\s\-']+$/.test(value),
      message:
        'El nombre solo puede contener letras, espacios, guiones y apóstrofes.',
    },
  })
  name: string;

  @ApiProperty({
    description: 'El correo electrónico del cliente. Debe ser único.',
    type: String,
    minLength: 5,
    maxLength: 150,
  })
  @Prop({
    required: true,
    unique: true,
    index: 1,
    minlength: 5,
    maxlength: 150,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value: string) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: (args: any) => `${args.property} no es válido`,
    },
  })
  email: string;

  @ApiProperty({
    description: 'El número de teléfono del cliente. Debe ser único.',
    type: String,
  })
  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        return /^(?:\+?\d{1,3})?[-.\s]?(\(?\d{1,4}?\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
          value,
        );
      },
      message: (args: any) =>
        `${args.property} no es válido. Debe ser un número de teléfono válido.`,
    },
  })
  phone: string;

  @ApiProperty({
    description:
      'La contraseña del cliente. Debe contener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.',
    type: String,
  })
  @Prop({
    required: true,
    minlength: 8,
    validate: {
      validator: (value: string) => {
        // Requiere al menos una letra mayúscula, una letra minúscula, un número y un carácter especial
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(
          value,
        );
      },
      message: (args: any) =>
        `${args.property} debe contener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.`,
    },
  })
  password: string; // necesito tener una contraseña encriptada
}

export const ClientSchema = SchemaFactory.createForClass(Client);
