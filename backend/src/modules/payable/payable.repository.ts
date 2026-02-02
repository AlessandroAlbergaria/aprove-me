import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database';
import { CreatePayableDto, UpdatePayableDto } from './dto';
import { Payable } from '@prisma/client';

@Injectable()
export class PayableRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePayableDto): Promise<Payable> {
    return this.prisma.payable.create({
      data: {
        id: data.id,
        value: data.value,
        emissionDate: new Date(data.emissionDate),
        assignorId: data.assignor,
      },
    });
  }

  async findById(id: string): Promise<Payable | null> {
    return this.prisma.payable.findUnique({
      where: { id },
      include: { assignor: true },
    });
  }

  async findAll(): Promise<Payable[]> {
    return this.prisma.payable.findMany({
      include: { assignor: true },
    });
  }

  async update(id: string, data: UpdatePayableDto): Promise<Payable> {
    const updateData: any = {};

    if (data.value !== undefined) updateData.value = data.value;
    if (data.emissionDate !== undefined)
      updateData.emissionDate = new Date(data.emissionDate);
    if (data.assignor !== undefined) updateData.assignorId = data.assignor;

    return this.prisma.payable.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payable.delete({
      where: { id },
    });
  }
}
