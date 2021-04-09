import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  NotFoundException,
  Delete,
  Param,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async addUser(@Res() res, @Body() createUserDto: UserDto) {
    try {
      const user = await this.userService.addUser(createUserDto);
      return res.status(HttpStatus.OK).json({
        msg: 'User has been created successfully',
        user
      });
    } catch (e) {
      return res.status(HttpStatus.CONFLICT).json({
        msg: 'User already exists'
      });
    }
  }

  @UseGuards(AuthGuard())
  @Get(':userID')
  async getUser(@Res() res, @Param('userID') userID) {
    const user = await this.userService.getUser(userID);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  }

  @UseGuards(AuthGuard())
  @Put(':userID')
  async updateUser(
    @Res() res,
    @Param('userID') userID,
    @Body() createUserDto: UserDto,
  ) {
    const user = await this.userService.updateUser(userID, createUserDto);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      msg: 'User has been successfully updated',
      user,
    });
  }

  @UseGuards(AuthGuard())
  @Delete(':userID')
  async deleteUser(@Res() res, @Param('userID') userID) {
    const user = await this.userService.deleteUser(userID);
    if (!user) throw new NotFoundException('User does not exist');
    return res.status(HttpStatus.OK).json({
      msg: 'User has been deleted',
      user,
    });
  }

  @UseGuards(AuthGuard())
  @Get()
  async getAllUser(@Res() res) {
    const users = await this.userService.getAllUser();
    return res.status(HttpStatus.OK).json(users);
  }
}
