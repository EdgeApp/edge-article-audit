import chalk from 'chalk'
import inquirer from 'inquirer'

import { IntercomClient } from '../api/client'
import type {
  ArticleCreatePayload,
  ArticleFrontmatter,
  ArticleUpdatePayload
} from '../api/types'
import type { Config } from '../config'
import { markdownToHtml } from '../converters'
import {
  computeFileHash,
  createSpinner,
  findAllArticles,
  findArticleById,
  loadPullManifest,
  readArticle,
  savePullManifest,
  saveRawData,
  updateArticleFrontmatter
} from '../utils'

interface PushOptions {
  all?: boolean
  id?: string
  force?: boolean
  dryRun?: boolean
}

interface LocalArticle {
  path: string
  frontmatter: ArticleFrontmatter
  content: string
}

/**
 * Push articles to Intercom
 */
export async function pushCommand(
  config: Config,
  options: PushOptions
): Promise<void> {
  const client = new IntercomClient(config)

  if (options.id != null && options.id !== '') {
    await pushSingleArticle(client, options.id, options.dryRun === true)
  } else if (options.all === true) {
    await pushArticles(client, options)
  } else {
    const { mode } = await inquirer.prompt<{
      mode: 'changed' | 'force' | 'single'
    }>([
      {
        type: 'list',
        name: 'mode',
        message: 'What would you like to push?',
        choices: [
          {
            name: 'Changed articles (edits + new)',
            value: 'changed'
          },
          {
            name: 'All articles (force overwrite)',
            value: 'force'
          },
          { name: 'Single article by ID', value: 'single' }
        ]
      }
    ])

    if (mode === 'changed') {
      await pushArticles(client, { ...options, all: true })
    } else if (mode === 'force') {
      await pushArticles(client, { ...options, all: true, force: true })
    } else {
      const { articleId } = await inquirer.prompt<{ articleId: string }>([
        {
          type: 'input',
          name: 'articleId',
          message: 'Enter the article ID:',
          validate: input => input.trim() !== '' || 'Article ID is required'
        }
      ])
      await pushSingleArticle(client, articleId.trim(), options.dryRun === true)
    }
  }
}

/**
 * Push a single article by its Intercom ID
 */
async function pushSingleArticle(
  client: IntercomClient,
  id: string,
  dryRun: boolean
): Promise<void> {
  const spinner = createSpinner(`Looking for article ${id}...`).start()

  const filePath = await findArticleById(id)

  if (filePath == null) {
    spinner.fail(`Article ${id} not found locally`)
    console.log(
      chalk.yellow(
        'Run "yarn pull --id ' + id + '" first to fetch it from Intercom'
      )
    )
    return
  }

  spinner.text = `Reading ${filePath}...`

  const article = await readArticle(filePath)

  if (article == null) {
    spinner.fail(`Failed to read article from ${filePath}`)
    return
  }

  if (dryRun) {
    spinner.succeed(`Would push: ${article.frontmatter.title} (${id})`)
    return
  }

  // Conflict detection
  const conflict = await checkConflict(client, article.frontmatter)
  if (conflict != null) {
    spinner.warn(conflict)
    const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Push anyway? The remote version will be overwritten.',
        default: false
      }
    ])
    if (!proceed) {
      console.log(chalk.yellow('Aborted'))
      return
    }
  }

  spinner.text = `Pushing ${article.frontmatter.title}...`

  const htmlBody = markdownToHtml(article.content)

  const payload: ArticleUpdatePayload = {
    title: article.frontmatter.title,
    body: htmlBody,
    state: article.frontmatter.state
  }

  if (
    article.frontmatter.description != null &&
    article.frontmatter.description !== ''
  ) {
    payload.description = article.frontmatter.description
  }

  try {
    const updated = await client.updateArticle(id, payload)
    spinner.succeed(`Updated: ${updated.title}`)

    if (updated.url != null && updated.url !== '') {
      console.log(chalk.blue(`  → ${updated.url}`))
    }

    // Sync local state with remote after successful push
    await updateArticleFrontmatter(filePath, {
      updated_at: updated.updated_at
    })
    const manifest = await loadPullManifest()
    manifest[id] = {
      hash: await computeFileHash(filePath),
      path: filePath,
      pulledAt: Date.now()
    }
    await savePullManifest(manifest)
  } catch (error) {
    spinner.fail(`Failed to update article ${id}`)
    throw error
  }
}

/**
 * Push multiple articles with change detection, conflict checks, and new article support
 */
async function pushArticles(
  client: IntercomClient,
  options: PushOptions
): Promise<void> {
  const spinner = createSpinner('Scanning local articles...').start()

  const articleFiles = await findAllArticles()

  if (articleFiles.length === 0) {
    spinner.fail('No local articles found')
    console.log(chalk.yellow('Run "yarn pull --all" first to fetch articles'))
    return
  }

  // Categorise: existing (has intercom_id) vs new (no intercom_id)
  const existing: LocalArticle[] = []
  const newArticles: LocalArticle[] = []

  for (const filePath of articleFiles) {
    const article = await readArticle(filePath)
    if (article == null) continue

    const entry: LocalArticle = {
      path: filePath,
      frontmatter: article.frontmatter,
      content: article.content
    }

    if (
      article.frontmatter.intercom_id != null &&
      article.frontmatter.intercom_id !== ''
    ) {
      existing.push(entry)
    } else {
      newArticles.push(entry)
    }
  }

  // Detect changed articles unless --force
  let toPush: LocalArticle[]

  if (options.force === true) {
    toPush = existing
  } else {
    const manifest = await loadPullManifest()
    toPush = []

    for (const item of existing) {
      const id = item.frontmatter.intercom_id!
      const entry = manifest[id]

      if (entry == null) {
        toPush.push(item)
        continue
      }

      const currentHash = await computeFileHash(item.path)
      if (currentHash !== entry.hash) {
        toPush.push(item)
      }
    }
  }

  spinner.succeed(
    `Found ${existing.length} existing, ${newArticles.length} new, ${toPush.length} changed`
  )

  const totalWork = toPush.length + newArticles.length

  if (totalWork === 0) {
    console.log(chalk.green('\nNothing to push – all articles are up to date.'))
    return
  }

  // Dry-run summary
  if (options.dryRun === true) {
    console.log(chalk.blue('\n── Dry run ──\n'))

    if (toPush.length > 0) {
      console.log(chalk.bold(`Articles to update (${toPush.length}):`))
      for (const a of toPush) {
        console.log(
          chalk.yellow(
            `  ✎ ${a.frontmatter.title} (${a.frontmatter.intercom_id})`
          )
        )
      }
    }

    if (newArticles.length > 0) {
      console.log(
        chalk.bold(`\nNew articles to create (${newArticles.length}):`)
      )
      for (const a of newArticles) {
        console.log(chalk.cyan(`  + ${a.frontmatter.title}`))
      }
    }

    console.log(chalk.gray('\nRe-run without --dry-run to apply.\n'))
    return
  }

  // Confirm before pushing
  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Push ${toPush.length} updated and ${newArticles.length} new articles to Intercom?`,
      default: false
    }
  ])

  if (!confirm) {
    console.log(chalk.yellow('Aborted'))
    return
  }

  const manifest = await loadPullManifest()
  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  // ── Push changed existing articles ──
  if (toPush.length > 0) {
    console.log(chalk.blue('\nPushing updated articles...\n'))

    for (const item of toPush) {
      const id = item.frontmatter.intercom_id!

      // Conflict detection (skip for force pushes)
      if (options.force !== true) {
        const conflict = await checkConflict(client, item.frontmatter)
        if (conflict != null) {
          console.log(
            chalk.yellow(`  ⚠ ${item.frontmatter.title}: ${conflict}`)
          )
          const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
            {
              type: 'confirm',
              name: 'proceed',
              message: `  Push ${item.frontmatter.title} anyway?`,
              default: false
            }
          ])
          if (!proceed) {
            console.log(chalk.gray(`    Skipped`))
            skipCount++
            continue
          }
        }
      }

      try {
        const htmlBody = markdownToHtml(item.content)
        const payload: ArticleUpdatePayload = {
          title: item.frontmatter.title,
          body: htmlBody,
          state: item.frontmatter.state
        }
        if (
          item.frontmatter.description != null &&
          item.frontmatter.description !== ''
        ) {
          payload.description = item.frontmatter.description
        }

        const updated = await client.updateArticle(id, payload)
        console.log(chalk.green(`  ✓ ${updated.title}`))
        if (updated.url != null && updated.url !== '') {
          console.log(chalk.gray(`    → ${updated.url}`))
        }

        await updateArticleFrontmatter(item.path, {
          updated_at: updated.updated_at
        })
        manifest[id] = {
          hash: await computeFileHash(item.path),
          path: item.path,
          pulledAt: Date.now()
        }
        successCount++
      } catch (error) {
        console.log(chalk.red(`  ✗ ${item.frontmatter.title} (${id})`))
        console.log(chalk.gray(`    Error: ${(error as Error).message}`))
        errorCount++
      }
    }
  }

  // ── Create new articles ──
  if (newArticles.length > 0) {
    console.log(chalk.blue('\nCreating new articles...\n'))

    let authorId: number | null = null

    // Resolve author ID (needed by the Intercom API)
    try {
      const me = await client.getMe()
      authorId = parseInt(me.id, 10)
    } catch {
      console.log(
        chalk.red(
          '  Could not determine author ID. Set INTERCOM_AUTHOR_ID in .env or verify your access token.'
        )
      )
    }

    if (authorId != null) {
      for (const item of newArticles) {
        try {
          const htmlBody = markdownToHtml(item.content)
          const payload: ArticleCreatePayload = {
            title: item.frontmatter.title,
            author_id: authorId,
            body: htmlBody,
            state: item.frontmatter.state ?? 'draft'
          }
          if (
            item.frontmatter.description != null &&
            item.frontmatter.description !== ''
          ) {
            payload.description = item.frontmatter.description
          }
          if (item.frontmatter.parent_id != null) {
            payload.parent_id = item.frontmatter.parent_id
            payload.parent_type = item.frontmatter.parent_type ?? null
          }

          const created = await client.createArticle(payload)
          console.log(
            chalk.green(`  ✓ Created: ${created.title} (${created.id})`)
          )
          if (created.url != null && created.url !== '') {
            console.log(chalk.gray(`    → ${created.url}`))
          }

          // Update local file with the new metadata from Intercom
          await updateArticleFrontmatter(item.path, {
            intercom_id: created.id,
            workspace_id: created.workspace_id,
            updated_at: created.updated_at,
            url: created.url ?? undefined
          })
          await saveRawData(created)

          manifest[created.id] = {
            hash: await computeFileHash(item.path),
            path: item.path,
            pulledAt: Date.now()
          }
          successCount++
        } catch (error) {
          console.log(chalk.red(`  ✗ ${item.frontmatter.title}`))
          console.log(chalk.gray(`    Error: ${(error as Error).message}`))
          errorCount++
        }
      }
    } else {
      errorCount += newArticles.length
    }
  }

  await savePullManifest(manifest)

  console.log('')
  const parts = [`${successCount} pushed`]
  if (skipCount > 0) parts.push(`${skipCount} skipped`)
  if (errorCount > 0) parts.push(`${errorCount} errors`)
  console.log(chalk.bold(`Done! ${parts.join(', ')}`))
}

/**
 * Check whether the remote article was modified after our last pull.
 * Returns a warning string if there's a conflict, null if clean.
 */
async function checkConflict(
  client: IntercomClient,
  frontmatter: ArticleFrontmatter
): Promise<string | null> {
  if (frontmatter.intercom_id == null || frontmatter.updated_at == null) {
    return null
  }

  try {
    const remote = await client.getArticle(frontmatter.intercom_id)
    if (remote.updated_at > frontmatter.updated_at) {
      return `Remote was updated after your last pull (remote: ${new Date(remote.updated_at * 1000).toISOString()}, local: ${new Date(frontmatter.updated_at * 1000).toISOString()})`
    }
  } catch {
    // If we can't fetch the remote, skip conflict check
  }

  return null
}
