import { Injectable } from '@nestjs/common';
import { TokenParams } from '../auth/types/TokenParams';
import { RequestUserAgentParams } from '../auth/types/RequestUserAgentParams';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload, Tokens } from '../auth/types';
import { JwtService } from '@nestjs/jwt';
import { hashString } from '../common/utils';
import { v4 as uuidv4 } from 'uuid';
import { compare } from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createTokens(
    userId: number,
    userAgentParams: RequestUserAgentParams,
  ): Promise<Tokens> {
    const tokenId = uuidv4();
    const tokenParams = await this.prepareTokens(tokenId, userId);

    await this.saveToken(userId, tokenParams, userAgentParams);

    return tokenParams.tokens;
  }

  async deleteToken(tokenId: string) {
    return await this.prisma.token.delete({
      where: { id: tokenId },
    });
  }

  async updateTokens(tokenId: string, userId: number): Promise<Tokens> {
    const { tokens, hashedRefreshToken, refreshTokenExpiredDate } =
      await this.prepareTokens(tokenId, userId);

    await this.prisma.token.update({
      where: { id: tokenId },
      data: { token: hashedRefreshToken, expired: refreshTokenExpiredDate },
    });

    return tokens;
  }

  async checkToken(
    tokenId: string,
    token: string,
    userAgentParams: RequestUserAgentParams,
  ) {
    const { ip, hostname, userAgent } = userAgentParams;
    const findToken = await this.prisma.token.findUnique({
      where: { id: tokenId },
    });

    if (!findToken) {
      return false;
    }

    const tokenCorrect = await compare(token, findToken.token);

    if (!tokenCorrect) {
      return false;
    }

    const ipMatch = findToken.ip === ip;
    const hostnameMatch = findToken.host === hostname;
    const agentMatch = findToken.agent === userAgent;

    return ipMatch && hostnameMatch && agentMatch;
  }

  private async prepareTokens(
    tokenId: string,
    userId: number,
  ): Promise<TokenParams> {
    const tokens = await this.generateTokens({
      tokenId,
      sub: userId,
    });

    const refreshTokenExpiredDate = this.generateExpiredDateRefreshToken();
    const hashedRefreshToken = await hashString(tokens.refresh_token);

    return {
      tokenId,
      hashedRefreshToken,
      refreshTokenExpiredDate,
      tokens,
    };
  }

  private async saveToken(
    userId: number,
    tokenParams: TokenParams,
    userAgentParams: RequestUserAgentParams,
  ) {
    const { tokenId, hashedRefreshToken, refreshTokenExpiredDate } =
      tokenParams;
    const { userAgent, ip, hostname } = userAgentParams;

    return await this.prisma.token.create({
      data: {
        id: tokenId,
        token: hashedRefreshToken,
        expired: refreshTokenExpiredDate,
        userId,
        ip,
        agent: userAgent,
        host: hostname,
      },
    });
  }

  private async generateTokens(payload: JwtPayload): Promise<Tokens> {
    const atPromise = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });

    const rtPromise = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });

    const [access_token, refresh_token] = await Promise.all([
      atPromise,
      rtPromise,
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private generateExpiredDateRefreshToken() {
    return new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
  }
}
