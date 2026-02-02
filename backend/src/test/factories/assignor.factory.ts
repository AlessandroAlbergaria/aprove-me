import { Assignor } from '@prisma/client';

export const createMockAssignor = (overrides?: Partial<Assignor>): Assignor => {
  return {
    id: 'a47ac10b-58cc-4372-a567-0e02b2c3d480',
    document: '12345678900',
    email: 'test@example.com',
    phone: '11999999999',
    name: 'Test Assignor',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
