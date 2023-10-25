
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import   Strategy  = require('passport-42')

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private readonly authService: AuthService){
        super({
            clientID: 'u-s4t2ud-941b73c259f6d553c86a6684f13a7532d9ee7991657547ad9e0e69ec1a37f16d', // it's a best practice to put it your .env !!!!!
            clientSecret: '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', // it's a best practice to put it your .env !!!!!
            callbackURL: 'http://127.0.0.1:3000/auth/42/callback'
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done:any){
        done(null,profile);
    }
}