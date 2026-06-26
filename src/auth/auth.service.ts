import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SignupDto } from "./dto/signup.dto";
import SigninDto from "./dto/signin.dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService, 
        private config: ConfigService
    ) {}

    // A função que o seu Controller estava procurando
    async signup(dto: SignupDto) {
        const hash = await argon.hash(dto.password);
        try {
            const paciente = await (this.prisma.paciente as any).create({
                data: {
                    email: dto.email,
                    hash,
                    primeiroNome: dto.primeiroNome,
                    sobreNome: dto.sobreNome
                }
            });

            return { token: await this.signToken(paciente.id, paciente.email) };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ForbiddenException('Credenciais em uso');
            }
            throw error;
        }
    }

    async signin(dto: SigninDto) {
        const paciente = await (this.prisma.paciente as any).findFirst({
            where: { email: dto.email },
        });
        
        if (!paciente) throw new ForbiddenException('Email ou senha incorreto');

        const compararSenha = await argon.verify(paciente.hash as string, dto.password);
        if (!compararSenha) throw new ForbiddenException('Email ou senha incorreto');

        return {
            token: await this.signToken(paciente.id as string, paciente.email as string),
            id: paciente.id
        };
    }

    async signToken(pacienteId: string, email: string): Promise<string> {
        const payload = { sub: pacienteId, email };
        const secret = this.config.get('JWT_SECRET');
        return await this.jwt.signAsync(payload, { expiresIn: '15m', secret: secret });
    }
}