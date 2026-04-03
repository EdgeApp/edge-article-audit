import crypto from 'crypto'
import fs from 'fs-extra'
import matter from 'gray-matter'
import path from 'path'

import type {
  ArticleFrontmatter,
  IntercomArticle,
  IntercomCollection,
  IntercomSection
} from '../api/types'
import { PATHS } from '../config'
import { htmlToMarkdown } from '../converters'

// Maps for looking up collection/section names
let collectionsMap = new Map<string, IntercomCollection>()
let sectionsMap = new Map<string, IntercomSection>()

/**
 * Initialize the lookup maps for collections and sections
 */
export function initializeMaps(
  collections: IntercomCollection[],
  sections: IntercomSection[]
): void {
  collectionsMap = new Map(collections.map(c => [c.id, c]))
  sectionsMap = new Map(sections.map(s => [s.id, s]))
}

/**
 * Get collection by ID
 */
export function getCollection(id: string): IntercomCollection | undefined {
  return collectionsMap.get(id)
}

/**
 * Get section by ID
 */
export function getSection(id: string): IntercomSection | undefined {
  return sectionsMap.get(id)
}

/**
 * Slugify a string for use in file/folder names
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length
}

/**
 * Build the folder path for an article based on its parent hierarchy
 */
export function buildArticlePath(article: IntercomArticle): string {
  const parts: string[] = [PATHS.articles]

  // First, try to use parent_id/parent_type (older API format)
  if (
    article.parent_type === 'collection' &&
    article.parent_id != null &&
    article.parent_id !== ''
  ) {
    const collection = collectionsMap.get(article.parent_id)
    if (collection != null) {
      const slug = slugify(collection.name)
      parts.push(slug !== '' ? slug : `collection-${collection.id}`)
    } else {
      parts.push(`collection-${article.parent_id}`)
    }
  } else if (
    article.parent_type === 'section' &&
    article.parent_id != null &&
    article.parent_id !== ''
  ) {
    const section = sectionsMap.get(article.parent_id)
    if (section != null) {
      // Find the parent collection of this section
      const collection = collectionsMap.get(section.parent_id)
      if (collection != null) {
        const collSlug = slugify(collection.name)
        parts.push(collSlug !== '' ? collSlug : `collection-${collection.id}`)
      }
      const secSlug = slugify(section.name)
      parts.push(secSlug !== '' ? secSlug : `section-${section.id}`)
    } else {
      parts.push(`section-${article.parent_id}`)
    }
  } else if (article.parent_ids != null && article.parent_ids.length > 0) {
    // Use parent_ids array (newer API format) - first ID is typically the collection
    const parentId = String(article.parent_ids[0])
    const collection = collectionsMap.get(parentId)
    if (collection != null) {
      const slug = slugify(collection.name)
      parts.push(slug !== '' ? slug : `collection-${collection.id}`)
    } else {
      parts.push(`collection-${parentId}`)
    }
  } else {
    // Articles without a parent go in root articles folder
    parts.push('_uncategorized')
  }

  return path.join(...parts)
}

/**
 * Build the filename for an article
 */
export function buildArticleFilename(article: IntercomArticle): string {
  const slug = slugify(article.title)
  return `${article.id}-${slug !== '' ? slug : 'untitled'}.md`
}

/**
 * gray-matter treats leading `---` as YAML frontmatter. When Turndown converts a
 * leading `<hr>` into `---`, the Markdown body can start with `---` and
 * `matter.stringify()` will try to parse it as YAML and throw.
 *
 * This strips a single leading horizontal rule if it is the first non-empty
 * line of the body.
 */
function stripLeadingHorizontalRule(markdown: string): string {
  const lines = markdown.split(/\r?\n/)
  let i = 0

  // Skip leading blank lines
  while (i < lines.length && lines[i].trim() === '') i++

  // If the first non-empty line is a horizontal rule, remove it
  if (i < lines.length && lines[i].trim() === '---') {
    i++
    // Also drop any blank lines immediately after the rule
    while (i < lines.length && lines[i].trim() === '') i++
    return lines.slice(i).join('\n').trimStart()
  }

  return markdown
}

/**
 * Write an article to disk as a Markdown file with YAML frontmatter
 */
export async function writeArticle(article: IntercomArticle): Promise<string> {
  const folderPath = buildArticlePath(article)
  const filename = buildArticleFilename(article)
  const filePath = path.join(folderPath, filename)

  // Ensure directory exists
  await fs.ensureDir(folderPath)

  // Build frontmatter - only include defined values (YAML can't serialize undefined)
  const frontmatter: Partial<ArticleFrontmatter> = {
    title: article.title,
    intercom_id: article.id,
    workspace_id: article.workspace_id,
    state: article.state,
    default_locale: article.default_locale ?? 'en',
    parent_type: article.parent_type ?? null,
    parent_id: article.parent_id ?? null,
    updated_at: article.updated_at
  }

  // Add optional fields only if they have values
  if (article.description != null) {
    frontmatter.description = article.description
  }
  if (article.url != null) {
    frontmatter.url = article.url
  }

  // Convert HTML body to Markdown
  const markdownBody = stripLeadingHorizontalRule(
    htmlToMarkdown(article.body ?? '')
  )

  // Combine frontmatter and content
  const fileContent = matter.stringify(markdownBody, frontmatter)

  // Write to disk
  await fs.writeFile(filePath, fileContent, 'utf-8')

  return filePath
}

/**
 * Save raw JSON data for an article (for reference/backup)
 */
export async function saveRawData(
  article: IntercomArticle,
  subdir: string = 'articles'
): Promise<string> {
  const dataPath = path.join(PATHS.data, subdir)
  await fs.ensureDir(dataPath)

  const filename = `${article.id}.json`
  const filePath = path.join(dataPath, filename)

  await fs.writeJson(filePath, article, { spaces: 2 })

  return filePath
}

/**
 * Save collections data
 */
export async function saveCollections(
  collections: IntercomCollection[]
): Promise<void> {
  const dataPath = path.join(PATHS.data, 'collections')
  await fs.ensureDir(dataPath)

  for (const collection of collections) {
    const filePath = path.join(dataPath, `${collection.id}.json`)
    await fs.writeJson(filePath, collection, { spaces: 2 })
  }
}

/**
 * Save sections data
 */
export async function saveSections(sections: IntercomSection[]): Promise<void> {
  const dataPath = path.join(PATHS.data, 'sections')
  await fs.ensureDir(dataPath)

  for (const section of sections) {
    const filePath = path.join(dataPath, `${section.id}.json`)
    await fs.writeJson(filePath, section, { spaces: 2 })
  }
}

/**
 * Read an article from a Markdown file
 */
export async function readArticle(
  filePath: string
): Promise<{ frontmatter: ArticleFrontmatter; content: string } | null> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const parsed = matter(fileContent)

    return {
      frontmatter: parsed.data as ArticleFrontmatter,
      content: parsed.content
    }
  } catch {
    return null
  }
}

/**
 * Find all article markdown files in the articles directory
 */
export async function findAllArticles(): Promise<string[]> {
  const articles: string[] = []

  async function scanDir(dir: string): Promise<void> {
    if (!(await fs.pathExists(dir))) {
      return
    }

    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        await scanDir(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        articles.push(fullPath)
      }
    }
  }

  await scanDir(PATHS.articles)
  return articles
}

/**
 * Find an article file by its Intercom ID
 */
export async function findArticleById(id: string): Promise<string | null> {
  const allArticles = await findAllArticles()

  for (const filePath of allArticles) {
    const article = await readArticle(filePath)
    if (article?.frontmatter.intercom_id === id) {
      return filePath
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// Pull manifest – tracks file hashes at pull time for change detection
// ---------------------------------------------------------------------------

export interface PullManifestEntry {
  hash: string
  path: string
  pulledAt: number
}

export type PullManifest = Record<string, PullManifestEntry>

const PULL_MANIFEST_PATH = path.join(PATHS.data, '.pull-manifest.json')

export async function computeFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf-8')
  return crypto.createHash('sha256').update(content).digest('hex')
}

export async function loadPullManifest(): Promise<PullManifest> {
  try {
    return await fs.readJson(PULL_MANIFEST_PATH)
  } catch {
    return {}
  }
}

export async function savePullManifest(manifest: PullManifest): Promise<void> {
  await fs.ensureDir(path.dirname(PULL_MANIFEST_PATH))
  await fs.writeJson(PULL_MANIFEST_PATH, manifest, { spaces: 2 })
}

// ---------------------------------------------------------------------------
// Orphan cleanup – remove local articles not present on Intercom
// ---------------------------------------------------------------------------

export async function removeOrphanedArticles(
  remoteIds: Set<string>
): Promise<string[]> {
  const removed: string[] = []
  const allLocalFiles = await findAllArticles()

  for (const filePath of allLocalFiles) {
    const article = await readArticle(filePath)
    if (article == null) continue

    const id = article.frontmatter.intercom_id
    if (id != null && id !== '' && !remoteIds.has(id)) {
      await fs.remove(filePath)
      removed.push(filePath)

      const jsonPath = path.join(PATHS.data, 'articles', `${id}.json`)
      if (await fs.pathExists(jsonPath)) {
        await fs.remove(jsonPath)
      }
    }
  }

  await removeEmptyDirs(PATHS.articles)
  return removed
}

async function removeEmptyDirs(dir: string): Promise<void> {
  if (!(await fs.pathExists(dir))) return

  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeEmptyDirs(path.join(dir, entry.name))
    }
  }

  const remaining = await fs.readdir(dir)
  if (remaining.length === 0 && dir !== PATHS.articles) {
    await fs.remove(dir)
  }
}

// ---------------------------------------------------------------------------
// Frontmatter update – patch an existing file's YAML header in place
// ---------------------------------------------------------------------------

export async function updateArticleFrontmatter(
  filePath: string,
  updates: Partial<ArticleFrontmatter>
): Promise<void> {
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const parsed = matter(fileContent)
  const updated = { ...parsed.data, ...updates }
  await fs.writeFile(
    filePath,
    matter.stringify(parsed.content, updated),
    'utf-8'
  )
}
