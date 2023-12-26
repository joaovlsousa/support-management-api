import { z } from 'zod'

export const signUpBodySchema = z.object({
  name: z
    .string({ required_error: 'Informe seu nome' })
    .min(1, 'Credenciais inválidas'),
  email: z
    .string({ required_error: 'Informe seu e-mail' })
    .email('Credenciais inválidas'),
  password: z
    .string({ required_error: 'Crie sua senha' })
    .min(6, 'Credenciais inválidas'),
})

export const signInBodySchema = z.object({
  email: z
    .string({ required_error: 'Informe seu e-mail' })
    .email('Credenciais inválidas'),
  password: z
    .string({ required_error: 'Insira a senha' })
    .min(6, 'Credenciais inválidas'),
})

export const createClientBodySchema = z.object({
  name: z
    .string({ required_error: 'Informe o nome do cliente/empresa' })
    .min(1, 'Credenciais inválidas'),
  role: z.enum(['PEOPLE', 'COMPANY']).default('PEOPLE'),
  address: z.object({
    city: z
      .string({ required_error: 'Informe a cidade' })
      .min(1, 'Credenciais inválidas'),
    street: z
      .string({ required_error: 'Informe a rua' })
      .min(1, 'Credenciais inválidas'),
    number: z.number({ required_error: 'Informe o número' }).positive(),
  }),
})

export const createSupportBodySchema = z.object({})

export const updateUserSchema = z.object({
  name: z.string({ required_error: 'Informe o nome' }).min(3, 'Nome inválido'),
})
