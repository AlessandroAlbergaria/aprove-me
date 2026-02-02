import { z } from 'zod';

export const assignorSchema = z.object({
  id: z
    .string({ message: 'ID é obrigatório' })
    .uuid({ message: 'ID deve ser um UUID válido' })
    .min(1, { message: 'ID é obrigatório' }),
  document: z
    .string({ message: 'Documento é obrigatório' })
    .min(1, { message: 'Documento é obrigatório' })
    .max(30, { message: 'Documento deve ter no máximo 30 caracteres' })
    .regex(/^[0-9]+$/, { message: 'Documento deve conter apenas números' }),
  email: z
    .string({ message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' })
    .max(140, { message: 'Email deve ter no máximo 140 caracteres' }),
  phone: z
    .string({ message: 'Telefone é obrigatório' })
    .min(1, { message: 'Telefone é obrigatório' })
    .max(20, { message: 'Telefone deve ter no máximo 20 caracteres' }),
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(1, { message: 'Nome é obrigatório' })
    .max(140, { message: 'Nome deve ter no máximo 140 caracteres' }),
});

export const createAssignorSchema = assignorSchema;

export const updateAssignorSchema = z.object({
  document: z
    .string()
    .min(1, { message: 'Documento é obrigatório' })
    .max(30, { message: 'Documento deve ter no máximo 30 caracteres' })
    .regex(/^[0-9]+$/, { message: 'Documento deve conter apenas números' })
    .optional(),
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .max(140, { message: 'Email deve ter no máximo 140 caracteres' })
    .optional(),
  phone: z
    .string()
    .min(1, { message: 'Telefone é obrigatório' })
    .max(20, { message: 'Telefone deve ter no máximo 20 caracteres' })
    .optional(),
  name: z
    .string()
    .min(1, { message: 'Nome é obrigatório' })
    .max(140, { message: 'Nome deve ter no máximo 140 caracteres' })
    .optional(),
});

export type AssignorFormData = z.infer<typeof assignorSchema>;
export type CreateAssignorFormData = z.infer<typeof createAssignorSchema>;
export type UpdateAssignorFormData = z.infer<typeof updateAssignorSchema>;
