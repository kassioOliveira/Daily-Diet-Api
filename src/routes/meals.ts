import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { theBestSequenceOfmeals } from '../helpers/the-best-sequence-of-meals'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const sessionId = req.cookies.sessionId

      const meals = await knex('meals').where('user_id', sessionId)

      return { meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(req.params)

      const { sessionId } = req.cookies

      const meal = await knex('meals')
        .where({
          id,
          user_id: sessionId,
        })
        .first()

      return { meal }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const sessionId = req.cookies.sessionId

      const meals = await knex('meals').where('user_id', sessionId)

      if (!meals) {
        return {}
      }
      const theBestSequenceIn24H = await theBestSequenceOfmeals(meals)
      const summary = {
        quantityOfOrdersMeals: meals.length,
        quantityOfMealsOnTheDiet: meals.filter((meal) => meal.isOnTheDiet)
          .length,
        quantityOfMealsOutTheDiet: meals.filter((meal) => !meal.isOnTheDiet)
          .length,
        theBestSequenceOfMealsOnTheDiet: theBestSequenceIn24H,
      }
      return { summary }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const createMealBodySchema = z.object({
        //     id: z.string(),
        name: z.string(),
        description: z.string(),
        isOnTheDiet: z.boolean().optional().default(true),
        //     user_id: z.string(),
      })

      const { name, description, isOnTheDiet } = createMealBodySchema.parse(
        req.body,
      )

      const sessionId = req.cookies.sessionId

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        isOnTheDiet,
        user_id: sessionId,
      })

      return res.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const getMealBodySchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        isOntheDiet: z.boolean().optional(),
        created_at: z.string().optional(),
      })

      const { id } = getMealsParamsSchema.parse(req.params)
      const updateBody = getMealBodySchema.parse(req.body)
      const { sessionId } = req.cookies

      await knex('meals')
        .where({
          id,
          user_id: sessionId,
        })
        .update(updateBody)

      return res.status(201).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, res) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(req.params)

      const { sessionId } = req.cookies

      await knex('meals')
        .where({
          id,
          user_id: sessionId,
        })
        .delete()

      return res.status(200).send()
    },
  )
}
