export type TUser = {
  name: string
  email: string
  username: string
  photo: string
  description: string
}

export type TPost = {
  user_id: string
  description: string
  images: string[]
}
