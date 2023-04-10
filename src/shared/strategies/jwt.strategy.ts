import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ForbiddenException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import customMessage from '../responses/customMessage.response';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const rawToken = req.headers['authorization'].split(' ')[1];
    await this.authService.verify(rawToken);
    if ((await this.authService.verify(rawToken)).length)
      throw new ForbiddenException(
        customMessage(HttpStatus.FORBIDDEN, 'user is not authorized'),
      );
    return { email: payload.email, roles: payload.roles };
  }
}
