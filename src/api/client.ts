import axios, { type AxiosError, type AxiosInstance } from 'axios'
import chalk from 'chalk'

import type { Config } from '../config'
import type {
  ArticleCreatePayload,
  ArticleUpdatePayload,
  IntercomAdmin,
  IntercomArticle,
  IntercomCollection,
  IntercomSection,
  PaginatedResponse
} from './types'

export class IntercomClient {
  private readonly client: AxiosInstance
  private readonly config: Config

  constructor(config: Config) {
    this.config = config
    this.client = axios.create({
      baseURL: config.server,
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Intercom-Version': config.version
      }
    })

    // Add response interceptor for rate limiting and error logging
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after']
          const waitTime =
            typeof retryAfter === 'string'
              ? parseInt(retryAfter, 10) * 1000
              : 5000
          console.log(
            chalk.yellow(`Rate limited. Waiting ${waitTime / 1000}s...`)
          )
          await this.sleep(waitTime)
          return await this.client.request(error.config!)
        }

        // Log detailed error info for debugging (skip for known expected cases)
        const data = error.response?.data as
          | { errors?: Array<{ code?: string }> }
          | undefined
        const isSectionsUnavailable =
          error.response?.status === 400 &&
          error.config?.url?.includes('/help_center/sections') === true &&
          data?.errors?.some?.(e => e.code === 'intercom_version_invalid') ===
            true

        if (error.response != null && !isSectionsUnavailable) {
          console.log(chalk.red(`\nAPI Error ${error.response.status}:`))
          console.log(chalk.gray(`  URL: ${error.config?.url}`))
          console.log(
            chalk.gray(`  Response: ${JSON.stringify(error.response.data)}`)
          )
        }

        throw error
      }
    )
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms))
  }

  // Articles
  async listArticles(): Promise<IntercomArticle[]> {
    const articles: IntercomArticle[] = []
    let page = 1

    while (true) {
      const response = await this.client.get<
        PaginatedResponse<IntercomArticle>
      >('/articles', { params: { page, per_page: 50 } })

      articles.push(...response.data.data)

      // Continue if there's a next page (next is a URL string when more pages exist)
      if (response.data.pages.next != null && response.data.pages.next !== '') {
        page++
      } else {
        break
      }
    }

    return articles
  }

  async getArticle(id: string): Promise<IntercomArticle> {
    const response = await this.client.get<IntercomArticle>(`/articles/${id}`)
    return response.data
  }

  async updateArticle(
    id: string,
    payload: ArticleUpdatePayload
  ): Promise<IntercomArticle> {
    const response = await this.client.put<IntercomArticle>(
      `/articles/${id}`,
      payload
    )
    return response.data
  }

  async createArticle(payload: ArticleCreatePayload): Promise<IntercomArticle> {
    const response = await this.client.post<IntercomArticle>(
      '/articles',
      payload
    )
    return response.data
  }

  async getMe(): Promise<IntercomAdmin> {
    const response = await this.client.get<IntercomAdmin>('/me')
    return response.data
  }

  // Collections
  async listCollections(): Promise<IntercomCollection[]> {
    const collections: IntercomCollection[] = []
    let page = 1

    while (true) {
      const response = await this.client.get<
        PaginatedResponse<IntercomCollection>
      >('/help_center/collections', { params: { page, per_page: 50 } })

      collections.push(...response.data.data)

      // Continue if there's a next page
      if (response.data.pages.next != null && response.data.pages.next !== '') {
        page++
      } else {
        break
      }
    }

    return collections
  }

  async getCollection(id: string): Promise<IntercomCollection> {
    const response = await this.client.get<IntercomCollection>(
      `/help_center/collections/${id}`
    )
    return response.data
  }

  // Sections
  async listSections(): Promise<IntercomSection[]> {
    const sections: IntercomSection[] = []
    let page = 1

    while (true) {
      const response = await this.client.get<
        PaginatedResponse<IntercomSection>
      >('/help_center/sections', { params: { page, per_page: 50 } })

      sections.push(...response.data.data)

      // Continue if there's a next page
      if (response.data.pages.next != null && response.data.pages.next !== '') {
        page++
      } else {
        break
      }
    }

    return sections
  }
}
