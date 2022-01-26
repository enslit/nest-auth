import { JwtPayload } from './JwtPayload';

export interface JwtPayloadWithRt extends JwtPayload {
  refreshToken: string;
}
