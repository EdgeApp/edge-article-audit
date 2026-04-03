import chalk from 'chalk'
import inquirer from 'inquirer'

import { IntercomClient } from '../api/client'
import type { IntercomArticle, IntercomSection } from '../api/types'
import type { Config } from '../config'
import {
  computeFileHash,
  createSpinner,
  initializeMaps,
  loadPullManifest,
  removeOrphanedArticles,
  saveCollections,
  savePullManifest,
  saveRawData,
  saveSections,
  writeArticle
} from '../utils'

interface PullOptions {
  all?: boolean
  id?: string
  clean?: boolean
}

/**
 * Fetch Help Center structure (collections and optionally sections)
 * Sections may not be available in newer API versions
 */
async function fetchStructure(
  client: IntercomClient
): Promise<{ collectionsCount: number; sectionsCount: number }> {
  const collections = await client.listCollections()

  let sections: IntercomSection[] = []
  try {
    sections = await client.listSections()
  } catch {
    console.log(
      chalk.yellow(
        '  Note: Sections API not available in current API version, organizing by collections only'
      )
    )
  }

  initializeMaps(collections, sections)
  await saveCollections(collections)
  if (sections.length > 0) {
    await saveSections(sections)
  }

  return {
    collectionsCount: collections.length,
    sectionsCount: sections.length
  }
}

/**
 * Pull articles from Intercom
 */
export async function pullCommand(
  config: Config,
  options: PullOptions
): Promise<void> {
  const client = new IntercomClient(config)

  let articlesToPull: IntercomArticle[] = []

  if (options.id != null && options.id !== '') {
    const spinner = createSpinner(`Fetching article ${options.id}...`).start()

    try {
      const article = await client.getArticle(options.id)
      articlesToPull = [article]
      spinner.succeed(`Fetched article: ${article.title}`)
    } catch (error) {
      spinner.fail(`Failed to fetch article ${options.id}`)
      throw error
    }
  } else if (options.all === true) {
    await pullAll(client, options.clean === true)
    return
  } else {
    const { mode } = await inquirer.prompt<{
      mode: 'all' | 'all-clean' | 'single'
    }>([
      {
        type: 'list',
        name: 'mode',
        message: 'What would you like to pull?',
        choices: [
          { name: 'All articles', value: 'all' },
          {
            name: 'All articles (clean sync – remove local orphans)',
            value: 'all-clean'
          },
          { name: 'Single article by ID', value: 'single' }
        ]
      }
    ])

    if (mode === 'all' || mode === 'all-clean') {
      await pullAll(client, mode === 'all-clean')
      return
    } else {
      const { articleId } = await inquirer.prompt<{ articleId: string }>([
        {
          type: 'input',
          name: 'articleId',
          message: 'Enter the article ID:',
          validate: input => input.trim() !== '' || 'Article ID is required'
        }
      ])

      const spinner = createSpinner(`Fetching article ${articleId}...`).start()

      try {
        const article = await client.getArticle(articleId.trim())
        articlesToPull = [article]
        spinner.succeed(`Fetched article: ${article.title}`)
      } catch (error) {
        spinner.fail(`Failed to fetch article ${articleId}`)
        throw error
      }
    }
  }

  // Single article pull – still need collections for path building
  if (articlesToPull.length > 0) {
    const structureSpinner = createSpinner(
      'Fetching Help Center structure...'
    ).start()

    try {
      const { collectionsCount, sectionsCount } = await fetchStructure(client)
      const sectionsMsg = sectionsCount > 0 ? `, ${sectionsCount} sections` : ''
      structureSpinner.succeed(
        `Loaded ${collectionsCount} collections${sectionsMsg}`
      )
    } catch (error) {
      structureSpinner.fail('Failed to fetch Help Center structure')
      throw error
    }

    const manifest = await loadPullManifest()

    for (const article of articlesToPull) {
      const filePath = await writeArticle(article)
      await saveRawData(article)
      manifest[article.id] = {
        hash: await computeFileHash(filePath),
        path: filePath,
        pulledAt: Date.now()
      }
      console.log(chalk.green(`  ✓ ${article.title}`))
      console.log(chalk.gray(`    → ${filePath}`))
    }

    await savePullManifest(manifest)
  }
}

/**
 * Pull all articles, collections, and sections
 */
async function pullAll(client: IntercomClient, clean: boolean): Promise<void> {
  const structureSpinner = createSpinner(
    'Fetching Help Center structure...'
  ).start()

  try {
    const { collectionsCount, sectionsCount } = await fetchStructure(client)
    const sectionsMsg = sectionsCount > 0 ? `, ${sectionsCount} sections` : ''
    structureSpinner.succeed(
      `Loaded ${collectionsCount} collections${sectionsMsg}`
    )
  } catch (error) {
    structureSpinner.fail('Failed to fetch Help Center structure')
    throw error
  }

  const articlesSpinner = createSpinner('Fetching all articles...').start()

  let articles: IntercomArticle[]

  try {
    articles = await client.listArticles()
    articlesSpinner.succeed(`Fetched ${articles.length} articles`)
  } catch (error) {
    articlesSpinner.fail('Failed to fetch articles')
    throw error
  }

  console.log(chalk.blue('\nWriting articles to disk...\n'))

  const manifest = await loadPullManifest()
  const remoteIds = new Set<string>()
  let successCount = 0
  let errorCount = 0

  for (const article of articles) {
    remoteIds.add(article.id)
    try {
      const filePath = await writeArticle(article)
      await saveRawData(article)
      manifest[article.id] = {
        hash: await computeFileHash(filePath),
        path: filePath,
        pulledAt: Date.now()
      }
      console.log(chalk.green(`  ✓ ${article.title}`))
      console.log(chalk.gray(`    → ${filePath}`))
      successCount++
    } catch (error) {
      console.log(chalk.red(`  ✗ ${article.title} (${article.id})`))
      console.log(chalk.gray(`    Error: ${(error as Error).message}`))
      errorCount++
    }
  }

  // Clean orphaned local files if requested
  if (clean) {
    console.log(chalk.blue('\nCleaning orphaned local files...\n'))
    const removed = await removeOrphanedArticles(remoteIds)

    if (removed.length > 0) {
      for (const filePath of removed) {
        console.log(chalk.yellow(`  ✗ Removed: ${filePath}`))
      }
      // Remove orphaned entries from manifest
      for (const id of Object.keys(manifest)) {
        if (!remoteIds.has(id)) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete manifest[id]
        }
      }
    } else {
      console.log(chalk.gray('  No orphaned files found'))
    }
  }

  await savePullManifest(manifest)

  console.log('')
  console.log(
    chalk.bold(
      `Done! ${successCount} articles written${errorCount > 0 ? `, ${errorCount} errors` : ''}`
    )
  )
}
