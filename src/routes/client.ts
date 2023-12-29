import { FastifyInstance } from 'fastify'
import { z } from 'zod'
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
        include: {
          address: {
            select: {
              city: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return reply.status(200).send({ clients })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.get('/clients/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().cuid2(),
    })

    try {
      const params = paramsSchema.safeParse(req.params)

      if (!params.success) {
        return reply.status(404).send({ error: 'Cliente não encontrado' })
      }

      const client = await db.client.findUnique({
        where: {
          id: params.data.id,
        },
        include: {
          address: true,
        },
      })

      if (!client) {
        return reply.status(404).send({ error: 'Cliente não encontrado' })
      }

      return reply.status(200).send({ client })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.delete('/clients/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().cuid2(),
    })

    try {
      const params = paramsSchema.safeParse(req.params)

      if (!params.success) {
        return reply.status(404).send({ error: 'Cliente não encontrado' })
      }

      const existsClient = await db.client.findUnique({
        where: {
          id: params.data.id,
          userId: req.user.sub,
        },
      })

      if (!existsClient) {
        return reply.status(404).send({ error: 'Cliente não encontrado' })
      }

      const client = await db.client.delete({
        where: {
          id: existsClient.id,
          userId: existsClient.userId,
        },
      })

      return reply.status(200).send({ client })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
