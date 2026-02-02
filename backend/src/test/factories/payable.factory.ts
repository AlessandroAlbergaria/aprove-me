import { Payable } from '@prisma/client';

export const createMockPayable = (overrides?: Partial<Payable>): Payable => {
  return {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    value: 1000.0,
    emissionDate: new Date('2024-01-01'),
    assignorId: 'a47ac10b-58cc-4372-a567-0e02b2c3d480',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
