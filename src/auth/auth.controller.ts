import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto'

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post() 
    async login(@Body() loginUserDto: LoginUserDto, @Res() res){
        const result = await this.authService.validateUserByPassword(loginUserDto);
        if (result.success) {
            return res.json(result.data);
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({msg: result.msg});
        }
    }
}