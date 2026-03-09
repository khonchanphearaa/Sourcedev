export interface User {
  id: string
  name: string
  email: string
  bio?: string
  avatar?: string
}

export interface Article {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string,
  linkGithub?: string,
  tags: string[]
  author: User
  status: 'draft' | 'published'
  readTime: number
  views: number
  createdAt: string
  updatedAt: string
}

export interface Tag {
  _id: string
  count: number
}