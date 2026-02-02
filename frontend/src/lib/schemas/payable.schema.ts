import { z } from 'zod';

export const payableSchema = z.object({
  id: z
    .string({ message: 'ID é obrigatório' })
    .uuid({ message: 'ID deve ser um UUID válido' })
    .min(1, { message: 'ID é obrigatório' }),
  value: z
    .number({ message: 'Valor é obrigatório' })
    .positive({ message: 'Valor deve ser maior que zero' })
    .min(0.01, { message: 'Valor mínimo é R$ 0,01' }),
  emissionDate: z
    .string({ message: 'Data de emissão é obrigatória' })
    .datetime({ message: 'Data deve estar no formato ISO 8601' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve estar no formato YYYY-MM-DD' })),
  assignor: z
    .string({ message: 'Cedente é obrigatório' })
    .uuid({ message: 'ID do cedente deve ser um UUID válido' })
    .min(1, { message: 'Cedente é obrigatório' }),
});

export const createPayableSchema = payableSchema;

export const updatePayableSchema = z.object({
  value: z
    .number()
    .positive({ message: 'Valor deve ser maior que zero' })
    .min(0.01, { message: 'Valor mínimo é R$ 0,01' })
    .optional(),
  emissionDate: z
    .string()
    .datetime({ message: 'Data deve estar no formato ISO 8601' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve estar no formato YYYY-MM-DD' }))
    .optional(),
  assignor: z
    .string()
    .uuid({ message: 'ID do cedente deve ser um UUID válido' })
    .optional(),
});

export type PayableFormData = z.infer<typeof payableSchema>;
export type CreatePayableFormData = z.infer<typeof createPayableSchema>;
export type UpdatePayableFormData = z.infer<typeof updatePayableSchema>;
