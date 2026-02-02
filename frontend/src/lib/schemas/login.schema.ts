import { z } from 'zod';

export const loginSchema = z.object({
  login: z
    .string({ message: 'Login é obrigatório' })
    .min(1, { message: 'Login é obrigatório' })
    .min(3, { message: 'Login deve ter no mínimo 3 caracteres' }),
  password: z
    .string({ message: 'Senha é obrigatória' })
    .min(1, { message: 'Senha é obrigatória' })
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
