export interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  phone: string
  avatar_url?: string | null
  is_verified: boolean
}

export interface Todo {
  id: string
  title: string
  description?: string
  is_completed: boolean
  user: User
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  content?: string
  image_url?: string | null
  user: User
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  user: User
  createdAt: string
  updatedAt: string
}
