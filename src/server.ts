import 'dotenv/config'
import fastify from 'fastify'

import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { authRoutes } from './routes/auth'
import { clientRoutes } from './routes/client'
import { userRoutes } from './routes/user'

const app = fastify()
const jwtSecret = process.env.JWT_SECRET as string

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: jwtSecret,
})

app.register(authRoutes)
app.register(clientRoutes)
app.register(userRoutes)

app.listen({ port: 3333 }, (err, address) =>
  console.log(err ?? `Server is running on ${address}`),
)
