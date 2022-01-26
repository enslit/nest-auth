import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { Public, User, UserId } from '../common/decorators';
import { RtGuard } from '../common/guards';
import { CreateUserDto } from '../user/dto';
import { UserAgent } from '../common/decorators/user-agent.decorator';
import { RequestUserAgentParams } from './types/RequestUserAgentParams';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  signupLocal(
    @Body() dto: CreateUserDto,
    @UserAgent() userAgentParams: RequestUserAgentParams,
  ): Promise<Tokens> {
    return this.authService.signupLocal(dto, userAgentParams);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(
    @Body() dto: AuthDto,
    @UserAgent() userAgentParams: RequestUserAgentParams,
  ) {
    return this.authService.signinLocal(dto, userAgentParams);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@User('tokenId') tokenId: string) {
    return this.authService.logout(tokenId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @UserId() userId: number,
    @User('tokenId') tokenId: string,
    @User('refreshToken') refreshToken: string,
    @UserAgent() userAgent: RequestUserAgentParams,
  ): Promise<Tokens> {
    const requestParams = { userId, refreshToken, tokenId };
    return this.authService.refreshTokens(requestParams, userAgent);
  }
}
