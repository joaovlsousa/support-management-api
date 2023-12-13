import { FastifyInstance } from 'fastify'

interface User {
  id: string
  name: string
  email: string
}

export function createToken(app: FastifyInstance, user: User): string {
  const { id, name, email } = user
  const token = app.jwt.sign(
    { name, email },
    { sub: id, expiresIn: 60 * 60 * 24 * 7 },
  )

  return token
}
