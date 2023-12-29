import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../lib/db'
import { createSupportBodySchema } from '../schemas'

export async function supportRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req) => {
    await req.jwtVerify()
  })

  app.post('/supports', async (req, reply) => {
    try {
      const payload = createSupportBodySchema.safeParse(req.body)

      if (!payload.success) {
        return reply
          .status(400)
          .send({ error: payload.error.issues[0].message })
      }

      const support = await db.support.create({
        data: {
          title: payload.data.title,
          description: payload.data.description,
          priority: payload.data.priority,
          client: {
            connect: {
              id: payload.data.clientId,
            },
          },
          user: {
            connect: {
              id: req.user.sub,
            },
          },
        },
      })

      return reply.status(201).send({ support })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.get('/supports/u', async (req, reply) => {
    try {
      const supports = await db.support.findMany({
        where: {
          userId: req.user.sub,
        },
        include: {
          client: {
            select: {
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return reply.status(200).send({ supports })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.get('/supports/c/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().cuid2(),
    })

    try {
      const params = paramsSchema.safeParse(req.params)

      if (!params.success) {
        return reply.status(404).send({ error: 'Atendimento não encontrado' })
      }

      const supports = await db.support.findMany({
        where: {
          clientId: params.data.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return reply.status(200).send({ supports })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.get('/supports/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().cuid2(),
    })

    try {
      const params = paramsSchema.safeParse(req.params)

      if (!params.success) {
        return reply.status(404).send({ error: 'Atendimento não encontrado' })
      }

      const support = await db.support.findUnique({
        where: {
          id: params.data.id,
        },
        include: {
          client: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      })

      if (!support) {
        return reply.status(404).send({ error: 'Atendimento não encontrado' })
      }

      return reply.status(200).send({ support })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.delete('/supports/:id', async (req, reply) => {
    const paramsSchema = z.object({
      id: z.string().cuid2(),
    })

    try {
      const params = paramsSchema.safeParse(req.params)

      if (!params.success) {
        return reply.status(404).send({ error: 'Atendimento não encontrado' })
      }

      const existsSupport = await db.support.findUnique({
        where: {
          id: params.data.id,
          userId: req.user.sub,
        },
      })

      if (!existsSupport) {
        return reply.status(404).send({ error: 'Atendimento não encontrado' })
      }

      const support = await db.support.delete({
        where: {
          id: existsSupport.id,
          userId: existsSupport.userId,
          clientId: existsSupport.clientId,
        },
      })

      return reply.status(200).send({ support })
    } catch (error) {
      console.log(error)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
