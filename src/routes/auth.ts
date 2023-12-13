import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'

import { db } from '../lib/db'
import { signInBodySchema, signUpBodySchema } from '../schemas'
import { createToken } from '../utils/create-token'

export async function authRoutes(app: FastifyInstance) {
  app.post('/sign-up', async (req, reply) => {
    try {
      const payload = signUpBodySchema.safeParse(req.body)

      if (!payload.success) {
        return reply
          .status(400)
          .send({ error: payload.error.issues[0].message })
      }

      const userExists = await db.user.findUnique({
        where: {
          email: payload.data.email,
        },
      })

      if (userExists) {
        return reply
          .status(400)
          .send({ error: 'Este usuário já foi cadastrado no sistema' })
      }

      const encryptedPassword = await bcrypt.hash(payload.data.password, 10)

      const user = await db.user.create({
        data: {
          name: payload.data.name,
          email: payload.data.email,
          password: encryptedPassword,
        },
      })

      const token = createToken(app, user)

      return reply.status(201).send({ token })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.post('/sign-in', async (req, reply) => {
    try {
      const payload = signInBodySchema.safeParse(req.body)

      if (!payload.success) {
        return reply
          .status(400)
          .send({ error: payload.error.issues[0].message })
      }

      const user = await db.user.findUnique({
        where: {
          email: payload.data.email,
        },
      })

      if (!user) {
        return reply.status(400).send({ error: 'E-mail ou senha inválidos' })
      }

      const passwordIsCorrect = await bcrypt.compare(
        payload.data.password,
        user.password,
      )

      if (!passwordIsCorrect) {
        return reply.status(400).send({ error: 'E-mail ou senha inválidos' })
      }

      const token = createToken(app, user)

      return reply.status(200).send({ token })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
