import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.jwtSecret,
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(request: Request, validationPayload:{id:number}){
        const user = await this.userService.findOneInternal(validationPayload.id);
        if(!user){
            throw new UnauthorizedException("invalid user");
        }
        return {...user, role: user.role};
    }

    private extractJwtToken(request: any): string | null{ 
        const token = request.headers.authorization;
        if(token && token.startsWith('Bearer ')){
            return token.substring(7);
        }else{
            return null;
        }
    }
}