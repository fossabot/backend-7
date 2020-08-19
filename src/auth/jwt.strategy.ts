import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from './constants';

interface JWTValidationObject {
  _id: string,
  email: string
}

interface JWTPayload {
  username: string,
  sub: string,
  iat: number,
  exp: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(jwtConstants.JWT_SECRET_KEY),
    });
  }

  async validate(payload: JWTPayload): Promise<JWTValidationObject> {
    return { _id: payload.sub, email: payload.username };
  }
}
