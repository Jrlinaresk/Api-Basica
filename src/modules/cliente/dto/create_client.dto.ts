import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Length,
  Matches,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description:
      'El nombre del cliente, debe contener entre 3 y 30 caracteres.',
    minLength: 3,
    maxLength: 30,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(30, { message: 'El nombre no puede tener más de 30 caracteres.' })
  name: string;

  @ApiProperty({
    description:
      'El correo electrónico del cliente. Debe ser único y tener un formato válido.',
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @MaxLength(150, {
    message: 'El correo electrónico no puede tener más de 150 caracteres.',
  })
  email: string;

  @ApiProperty({
    description:
      'El número de teléfono del cliente. Debe ser único y tener un formato válido.',
  })
  @IsNotEmpty({ message: 'El número de teléfono es obligatorio.' })
  @IsString({ message: 'El número de teléfono debe ser una cadena de texto.' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'El número de teléfono no es válido.',
  })
  phone: string;

  @ApiProperty({
    description:
      'La contraseña del cliente. Debe contener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.',
  })
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @Length(8)
  @Matches(/(?=.*[a-z])/, {
    message: 'debe contener al menos una letra minúscula',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'debe contener al menos una letra mayúscula',
  })
  @Matches(/(?=.*[0-9])/, { message: 'debe contener al menos un número' })
  @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
    message: 'debe contener al menos un carácter especial',
  })
  password: string;
}
