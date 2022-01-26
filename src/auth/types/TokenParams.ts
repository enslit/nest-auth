import { Tokens } from './Tokens';

export interface TokenParams {
  tokenId: string;
  hashedRefreshToken: string;
  refreshTokenExpiredDate: Date;
  tokens: Tokens;
}
