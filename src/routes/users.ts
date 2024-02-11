import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users')

    return { users }
  })

  app.post('/', async (req, res) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createUserBodySchema.parse(req.body)

    const sessionId = randomUUID()
    await knex('users').insert({
      id: sessionId,
      name,
    })

    res.cookie('sessionId', `${sessionId}`, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res.status(201).send()
  })
}
