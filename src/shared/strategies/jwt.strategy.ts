import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

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
      throw new ForbiddenException('User is not authorized');
    return { email: payload.email, roles: payload.roles };
  }
}
