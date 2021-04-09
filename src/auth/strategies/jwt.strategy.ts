import { ConfigService } from './../../config/config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService, private configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: (request, jwtToken, done) => {
                done(null, configService.get('JWT_SECRET'));
              },
        });
    }

    async validate(payload: JwtPayload){
        const user = await this.authService.validateUser(payload);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

}