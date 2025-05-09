
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService, 
    ){}

    async generateAccessToken(payload: any){
        const access_token = await this.jwtService.signAsync(payload,{secret: process.env.jwtSecret});
        await this.userService.updateAccessToken(payload.id,access_token);
        return access_token;

    }
}