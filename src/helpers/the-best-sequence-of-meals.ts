interface meals {
  id: string
  name: string
  description: string
  created_at: string
  isOnTheDiet: boolean
  user_id: string
}

export async function theBestSequenceOfmeals(meals: meals[]) {
  const thebestSequenceIn24H = meals.filter(
    (order) =>
      new Date(order.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000 &&
      order.isOnTheDiet,
  )
  return thebestSequenceIn24H
}
