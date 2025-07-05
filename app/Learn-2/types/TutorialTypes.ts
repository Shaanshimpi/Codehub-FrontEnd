export interface Language {
  id: string | number
  title: string
  index: number
  slug: string
  [key: string]: any
}

export interface Tutorial {
  id: string
  title: string
  slug: string
  index: number
  programmingLanguage: string | Language
  content: string
}

export interface PageProps {
  params: {
    slug: string
  }
}
