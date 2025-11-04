export type Post = {
  id: number
  title: string
  userId: number
  body: string
}

export type MainState = {
  posts: Post[]
}
