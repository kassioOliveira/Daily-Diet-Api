import { knex as setupKnex } from 'knex'
import { env } from './env'

export const config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extends: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
