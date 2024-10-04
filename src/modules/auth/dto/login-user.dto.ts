import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email para el usuario',
  })
  @IsEmail()
  @MinLength(5)
  @MaxLength(150)
  email: string;

  @ApiProperty({
    example: 'StrongPassw0rd!',
    description: 'Contraseña para el usuario',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
