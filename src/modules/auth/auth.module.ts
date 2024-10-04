import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './jwt/local.strategy';
import { ClientsModule } from '../cliente/cliente.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'ExampleSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
