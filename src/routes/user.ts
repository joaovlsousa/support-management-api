import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../lib/db'
import { updateUserSchema } from '../schemas'
import { createToken } from '../utils/create-token'

export async function userRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req) => {
    await req.jwtVerify()
  })

  app.get('/u/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().cuid2(),
    })

    try {
      const params = paramsSchema.safeParse(req.params)

      if (!params.success) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }

      const user = await db.user.findUnique({
        where: {
          id: params.data.id,
        },
        include: {
          _count: {
            select: {
              clients: true,
            },
          },
        },
      })

      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, _count, ...userData } = user
      const currentUser = {
        ...userData,
        totalClients: _count.clients,
      }

      return reply.status(200).send({ currentUser })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.patch('/u', async (req, reply) => {
    try {
      const payload = updateUserSchema.safeParse(req.body)

      if (!payload.success) {
        return reply
          .status(400)
          .send({ error: payload.error.issues[0].message })
      }

      const user = await db.user.update({
        where: {
          id: req.user.sub,
        },
        data: {
          name: payload.data.name,
        },
      })

      const token = createToken(app, user)

      return reply.status(200).send({ token })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
  app.delete('/u', async (req, reply) => {
    try {
      await db.user.delete({
        where: {
          id: req.user.sub,
        },
      })

      return reply.status(200).send({ message: 'sucesso' })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
