import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService){ }

    async validateUserByPassword(loginAttempt: LoginUserDto): Promise<any> {
        let userToAttempt: any = await this.usersService.findOneByEmail(loginAttempt.email);

        return new Promise((resolve) => {
            if (!userToAttempt) {
                resolve({success: false, msg: 'User not found'});
            }
            userToAttempt.checkPassword(loginAttempt.password, (err, isMatch) => {
                if(err) resolve({success: false, msg: 'Unexpected error. Please try again later.'});
    
                if(isMatch){
                    resolve({success: true, data: this.createJwtPayload(userToAttempt)});
                } else {
                    resolve({success: false, msg: 'Wrong password'})
                }
            });
        });
    }

    createJwtPayload(user){
        let data: JwtPayload = {
            id: user._id,
            email: user.email
        };

        let jwt = this.jwtService.sign(data);

        return {
            exp: 36000,
            token: jwt            
        }
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.getUser(payload.id);
    }
}