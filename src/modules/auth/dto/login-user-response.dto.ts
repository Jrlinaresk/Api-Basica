import { ApiProperty } from '@nestjs/swagger';

export class UserLoginResponseDto {
  @ApiProperty()
  access_token: string;
}
