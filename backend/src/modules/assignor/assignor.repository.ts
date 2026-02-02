import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database';
import { CreateAssignorDto, UpdateAssignorDto } from './dto';
import { Assignor } from '@prisma/client';

@Injectable()
export class AssignorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAssignorDto): Promise<Assignor> {
    return this.prisma.assignor.create({
      data: {
        id: data.id,
        document: data.document,
        email: data.email,
        phone: data.phone,
        name: data.name,
      },
    });
  }

  async findById(id: string): Promise<Assignor | null> {
    return this.prisma.assignor.findUnique({
      where: { id },
      include: { payables: true },
    });
  }

  async findByDocument(document: string): Promise<Assignor | null> {
    return this.prisma.assignor.findUnique({
      where: { document },
    });
  }

  async findAll(): Promise<Assignor[]> {
    return this.prisma.assignor.findMany({
      include: { payables: true },
    });
  }

  async update(id: string, data: UpdateAssignorDto): Promise<Assignor> {
    const updateData: any = {};

    if (data.document !== undefined) updateData.document = data.document;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.name !== undefined) updateData.name = data.name;

    return this.prisma.assignor.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.assignor.delete({
      where: { id },
    });
  }
}
