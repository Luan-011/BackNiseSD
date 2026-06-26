import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "./dto/signup.dto";
import SigninDto from "./dto/signin.dto";

@Controller('auth') // <--- Isso define o prefixo /auth
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin') // <--- Isso define a rota final /auth/signin
    signin(@Body() dto: SigninDto) {
        return this.authService.signin(dto);
    }
}