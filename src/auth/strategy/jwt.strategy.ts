import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: string; email: string }) {
        // Linha 17 aprox: Forçando o tipo para evitar erro de índice
        const paciente = await (this.prisma.paciente as any).findUnique({
            where: { id: payload.sub },
        });

        if (!paciente) {
            throw new UnauthorizedException('Usuário não autorizado');
        }

        // Técnica segura para remover propriedades de objetos
        const { hash, ...pacienteSemHash } = paciente;
        return pacienteSemHash;
    }
}