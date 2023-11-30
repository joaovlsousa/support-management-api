import { z } from 'zod'

export const signUpBodySchema = z.object({
  name: z.string().min(1, 'Credenciais inválidas'),
  email: z.string().email('Credenciais inválidas'),
  password: z.string().min(6, 'Credenciais inválidas'),
})

export const signInBodySchema = z.object({
  email: z.string().email('Credenciais inválidas'),
  password: z.string().min(6, 'Credenciais inválidas'),
})
