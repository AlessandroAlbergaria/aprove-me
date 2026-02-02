import { z } from 'zod';

export const userSchema = z.object({
  login: z
    .string({ message: 'Login é obrigatório' })
    .min(3, { message: 'Login deve ter no mínimo 3 caracteres' })
    .max(50, { message: 'Login deve ter no máximo 50 caracteres' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: 'Login deve conter apenas letras, números, underscore e hífen',
    }),
  password: z
    .string({ message: 'Senha é obrigatória' })
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
    .max(100, { message: 'Senha deve ter no máximo 100 caracteres' }),
});

export const createUserSchema = userSchema.extend({
  confirmPassword: z
    .string({ message: 'Confirmação de senha é obrigatória' })
    .min(6, { message: 'Confirmação deve ter no mínimo 6 caracteres' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export const updateUserSchema = z.object({
  login: z
    .string()
    .min(3, { message: 'Login deve ter no mínimo 3 caracteres' })
    .max(50, { message: 'Login deve ter no máximo 50 caracteres' })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: 'Login deve conter apenas letras, números, underscore e hífen',
    })
    .optional(),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
    .max(100, { message: 'Senha deve ter no máximo 100 caracteres' })
    .optional(),
  confirmPassword: z
    .string()
    .min(6, { message: 'Confirmação deve ter no mínimo 6 caracteres' })
    .optional(),
}).refine(
  (data) => {
    if (data.password && data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    return true;
  },
  {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  }
);

export type UserFormData = z.infer<typeof userSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
