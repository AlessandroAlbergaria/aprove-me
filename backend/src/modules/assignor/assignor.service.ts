import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { AssignorRepository } from './assignor.repository';
import { CreateAssignorDto, UpdateAssignorDto } from './dto';
import { Assignor } from '@prisma/client';

@Injectable()
export class AssignorService {
  constructor(private readonly repository: AssignorRepository) {}

  async create(data: CreateAssignorDto): Promise<Assignor> {
    const existingAssignor = await this.repository.findByDocument(
      data.document,
    );
    if (existingAssignor) {
      throw new ConflictException(
        `Cedente com documento ${data.document} já existe`,
      );
    }
    return this.repository.create(data);
  }

  async findById(id: string): Promise<Assignor> {
    const assignor = await this.repository.findById(id);
    if (!assignor) {
      throw new NotFoundException(`Cedente com ID ${id} não encontrado`);
    }
    return assignor;
  }

  async findAll(): Promise<Assignor[]> {
    return this.repository.findAll();
  }

  async update(id: string, data: UpdateAssignorDto): Promise<Assignor> {
    await this.findById(id);

    if (data.document) {
      const existingAssignor = await this.repository.findByDocument(
        data.document,
      );
      if (existingAssignor && existingAssignor.id !== id) {
        throw new ConflictException(
          `Cedente com documento ${data.document} já existe`,
        );
      }
    }

    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.delete(id);
  }
}
