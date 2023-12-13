import { FastifyInstance } from 'fastify'
import { db } from '../lib/db'
import { createClientBodySchema } from '../schemas'

export async function clientRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req) => {
    await req.jwtVerify()
  })

  app.post('/clients', async (req, reply) => {
    try {
      const payload = createClientBodySchema.safeParse(req.body)

      if (!payload.success) {
        return reply
          .status(400)
          .send({ error: payload.error.issues[0].message })
      }

      const client = await db.client.create({
        data: {
          name: payload.data.name,
          role: payload.data.role,
          address: {
            create: {
              ...payload.data.address,
            },
          },
          user: {
            connect: {
              id: req.user.sub,
            },
          },
        },
      })

      return reply.status(201).send({ client })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.get('/clients', async (req, reply) => {
    try {
      const clients = await db.client.findMany({
        where: {
          userId: req.user.sub,
        },
      })

      return reply.status(200).send({ clients })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
