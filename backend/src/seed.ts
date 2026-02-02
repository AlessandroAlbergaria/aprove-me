import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  console.log('🌱 Seeding database...');

  try {
    const user = await usersService.create({
      login: 'aprovame',
      password: 'aprovame',
    });

    console.log('✅ Created default user:', {
      id: user.id,
      login: user.login,
    });
  } catch (error) {
    if (error.message?.includes('Login já está em uso')) {
      console.log('✅ User "aprovame" already exists. Skipping seed.');
    } else {
      console.error('❌ Error during seed:', error);
      throw error;
    }
  }

  await app.close();
}

bootstrap().catch((e) => {
  console.error('❌ Error seeding database:', e);
  process.exit(1);
});
