import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    let databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';

    if (databaseUrl.startsWith('file:./') && !databaseUrl.includes('prisma/')) {
      databaseUrl = 'file:./prisma/' + databaseUrl.substring(7);
    }

    const adapter = new PrismaLibSql({
      url: databaseUrl,
    });

    super({
      adapter,
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
