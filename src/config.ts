import dotenv from 'dotenv'
import path from 'path'

// Load .env file from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export interface Config {
  accessToken: string
  server: string
  version: string
  defaultLocale: string
}

export function loadConfig(): Config {
  const accessToken = process.env.INTERCOM_ACCESS_TOKEN

  if (accessToken == null || accessToken === '') {
    throw new Error(
      'Missing INTERCOM_ACCESS_TOKEN. Set it in .env file or as environment variable.\n' +
        'See .env.example for the required format.'
    )
  }

  return {
    accessToken,
    server: process.env.INTERCOM_SERVER ?? 'https://api.intercom.io',
    version: process.env.INTERCOM_VERSION ?? '2.14',
    defaultLocale: process.env.INTERCOM_DEFAULT_LOCALE ?? 'en'
  }
}

// Paths relative to current working directory
export const PATHS = {
  articles: path.resolve(process.cwd(), 'articles'),
  data: path.resolve(process.cwd(), 'data')
}
