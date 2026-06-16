import { Injectable } from "@nestjs/common";
import { UpdateDto } from "src/auth/dto/update.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PacienteService {
    constructor(private prisma: PrismaService) { }

    async remove(id: string) {
        return await this.prisma.paciente.delete({
            where: { id },
        });
    }

    async update(id: string, data: UpdateDto) {
        return this.prisma.paciente.update({
            where: { id },
            data
        });
    }
}