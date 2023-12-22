import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../lib/db'

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
}
