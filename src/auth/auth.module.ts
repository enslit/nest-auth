import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './stratagies';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UserService, TokenService, RtStrategy, AtStrategy],
})
export class AuthModule {}
