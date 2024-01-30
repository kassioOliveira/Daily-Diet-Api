// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables'
export interface Tables {
  users: {
    id: string
    name: string
    created_at: string
  }
  meals: {
    id: string
    name: string
    description: string
    created_at: string
    isOnTheDiet: boolean
    user_id: string
  }
}
