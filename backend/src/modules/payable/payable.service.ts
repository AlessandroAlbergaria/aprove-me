import { Injectable, NotFoundException } from '@nestjs/common';
import { PayableRepository } from './payable.repository';
import { CreatePayableDto, UpdatePayableDto } from './dto';
import { Payable } from '@prisma/client';

@Injectable()
export class PayableService {
  constructor(private readonly repository: PayableRepository) {}

  async create(data: CreatePayableDto): Promise<Payable> {
    return this.repository.create(data);
  }

  async findById(id: string): Promise<Payable> {
    const payable = await this.repository.findById(id);
    if (!payable) {
      throw new NotFoundException(`Recebível com ID ${id} não encontrado`);
    }
    return payable;
  }

  async findAll(): Promise<Payable[]> {
    return this.repository.findAll();
  }

  async update(id: string, data: UpdatePayableDto): Promise<Payable> {
    await this.findById(id);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.delete(id);
  }
}
