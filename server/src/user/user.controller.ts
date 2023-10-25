import { Controller, Get, HttpException, Param, Post, HttpStatus, Body} from '@nestjs/common'
import { UseGuards, Req } from '@nestjs/common'
import { Room } from '../../../shared/chat.interface'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from './user.service'
import { User } from '@prisma/client'
import { VerifyCodeDto }  from './2fa.dto'

@Controller()
//@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/rooms')
  async getAllRooms(): Promise<Room[]> {
    return await this.userService.getRooms()
  }

  @Get('api/rooms/:room')
  async getRoom(@Param() params): Promise<Room> {
    const rooms = await this.userService.getRooms()
    const room = await this.userService.getRoomByName(params.room)
    return rooms[room]
  }
  @Post('2fa/activate')
  async activate2fa(@Req() req: any) {
    return await this.userService.activate2fa(req.user);
  }
  @Post('2fa/deactivate')
  async deactivate2fa(@Req() req: any) {
    return await this.userService.deactivate2fa(req.user);
  }
  @Post('2fa/verify')
  async verify2fa(@Req() req: any, @Body () body: VerifyCodeDto){
    const {code } = body;
    const user = await this.userService.verify2fa(req.user, code);
    if (user){
      throw new HttpException('Correct Code', HttpStatus.OK);
    }
    throw new HttpException('Incorrect Code', HttpStatus.BAD_REQUEST);
  }


}
