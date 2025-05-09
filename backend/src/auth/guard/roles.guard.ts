import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()

export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean{
        const requiredRole = this.reflector.get<string>("role", context.getHandler());
        if(!requiredRole){
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if(!user){
            throw new UnauthorizedException('user is not authorized')
        }
        if(user.roles ! == requiredRole){
            throw new UnauthorizedException('user have no permissions to access this resources')
        }
        return true;
    }
}

