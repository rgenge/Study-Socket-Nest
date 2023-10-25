import { Get, Controller, UseGuards, BadRequestException, Body, Req, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './strategy/42.guards';
import {AuthGuard} from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor (private AuthService: AuthService ){}

    @UseGuards(FortyTwoAuthGuard)

    @Get('login')
    async fortyTwoAuth(@Req() req: any) {
    }

    @Get('42/callback')
    @UseGuards(FortyTwoAuthGuard)

    async fortTwoRedirect( @Req() req:any,
    @Res({ passthrough: true }) res: any,) 
        {
            if (!req.user) return res.redirect(`${process.env.HOST_FRONT}/`);
            const { username, name, _json } = req.user;
            const image = _json?.image?.link;
            const jwt = await this.AuthService.login(username, name, image);
            res.cookie('jwt', jwt);
            return res.redirect(`${process.env.HOST_FRONT}/chat`);

        }
    
    @Get('logout')
    async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
        res.clearCookie('jwt');
        return res.redirect(process.env.HOST_FRONT);
      }
}