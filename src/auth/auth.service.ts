import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tokens } from './types';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';
import { AuthDto } from './dto';
import { RequestRefreshTokenParams } from './types/RequestRefreshTokenParams';
import { RequestUserAgentParams } from './types/RequestUserAgentParams';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signupLocal(
    dto: CreateUserDto,
    userAgentParams: RequestUserAgentParams,
  ): Promise<Tokens> {
    await this.checkUserExist(dto.email);
    const newUser = await this.userService.create(dto);

    return await this.tokenService.createTokens(newUser.id, userAgentParams);
  }

  async signinLocal(dto: AuthDto, userAgentParams: RequestUserAgentParams) {
    const credentialsCorrect = await this.userService.checkUserCredentials(dto);

    if (!credentialsCorrect) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const user = await this.userService.findUserByEmail(dto.email);

    return await this.tokenService.createTokens(user.id, userAgentParams);
  }

  async logout(token: string) {
    return await this.tokenService.deleteToken(token);
  }

  async refreshTokens(
    userParams: RequestRefreshTokenParams,
    userAgentParams: RequestUserAgentParams,
  ): Promise<Tokens> {
    const { userId, refreshToken, tokenId } = userParams;

    const tokenCorrect = await this.tokenService.checkToken(
      tokenId,
      refreshToken,
      userAgentParams,
    );

    if (!tokenCorrect) {
      throw new UnauthorizedException('Неверный токен');
    }

    return await this.tokenService.updateTokens(tokenId, userId);
  }

  private async checkUserExist(email: string) {
    const findUser = await this.userService.findUserByEmail(email);

    if (findUser) {
      throw new ConflictException(
        `Пользователь с email ${email} уже зарегистрирован`,
      );
    }
  }
}
