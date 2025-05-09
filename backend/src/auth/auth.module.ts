import { forwardRef, Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
    imports: [
        forwardRef(()=> UserModule),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: process.env.jwtSecret,
            signOptions: { expiresIn: '30d' }
        })
    ],
    controllers: [],
    providers: [JwtStrategy, AuthService],
    exports: [AuthService]
})

export class AuthModule {}
