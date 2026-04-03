// Intercom API response types

export interface IntercomArticle {
  id: string
  type: 'article'
  workspace_id: string
  title: string
  description: string | null
  body: string | null // HTML content
  author_id: number
  state: 'published' | 'draft'
  created_at: number
  updated_at: number
  url: string | null
  parent_id: string | null
  parent_ids?: number[] // Array of parent collection/section IDs (used in newer API)
  parent_type: 'collection' | 'section' | null
  default_locale?: string // May not be present in list response
  translated_content?: Record<string, TranslatedContent> | null
}

export interface TranslatedContent {
  type: 'article_translated_content'
  locale: string
  title: string
  description: string | null
  body: string
  author_id: number
  state: 'published' | 'draft'
  created_at: number
  updated_at: number
  url: string | null
}

export interface IntercomCollection {
  id: string
  type: 'collection'
  workspace_id: string
  name: string
  description: string | null
  created_at: number
  updated_at: number
  url: string | null
  icon: string | null
  order: number
  default_locale: string
  translated_content: Record<string, CollectionTranslatedContent> | null
  help_center_id: number | null
  parent_id: string | null
}

export interface CollectionTranslatedContent {
  type: 'collection_translated_content'
  locale: string
  name: string
  description: string | null
  url: string | null
}

export interface IntercomSection {
  id: string
  type: 'section'
  workspace_id: string
  name: string
  created_at: number
  updated_at: number
  url: string | null
  order: number
  default_locale: string
  parent_id: string
  translated_content: Record<string, SectionTranslatedContent> | null
}

export interface SectionTranslatedContent {
  type: 'section_translated_content'
  locale: string
  name: string
  url: string | null
}

export interface PaginatedResponse<T> {
  type: 'list'
  data: T[]
  total_count: number
  pages: {
    type: 'pages'
    page: number
    per_page: number
    total_pages: number
    next?: string | null // URL to next page, null if no more pages
  }
}

export interface ArticleUpdatePayload {
  title?: string
  description?: string
  body?: string
  state?: 'published' | 'draft'
  parent_id?: string | null
  parent_type?: 'collection' | 'section' | null
}

export interface ArticleCreatePayload {
  title: string
  author_id: number
  description?: string
  body?: string
  state?: 'published' | 'draft'
  parent_id?: string | null
  parent_type?: 'collection' | 'section' | null
}

export interface IntercomAdmin {
  type: 'admin'
  id: string
  name: string
  email: string
}

// Frontmatter metadata stored in markdown files
export interface ArticleFrontmatter {
  title: string
  intercom_id?: string
  workspace_id?: string
  state: 'published' | 'draft'
  default_locale?: string
  parent_type?: 'collection' | 'section' | null
  parent_id?: string | null
  description?: string
  url?: string
  updated_at?: number
}
