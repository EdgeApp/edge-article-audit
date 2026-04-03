# Edge Article Audit

A CLI tool for editing **Intercom Help Center** articles as Markdown instead of HTML.

## Problem

Intercom's Articles API returns article content as HTML, which is cumbersome to edit.

## Solution

Pull articles from Intercom, convert to Markdown, edit locally, push back.

## Features

- **Pull** – Fetch articles from Intercom via API, convert HTML → Markdown
- **Clean sync** – Remove local files that were deleted on Intercom (`--clean`)
- **Push** – Convert Markdown → HTML and sync back to Intercom
- **Smart push** – Only pushes articles you actually changed (hash-based detection)
- **Dry run** – Preview what would be pushed before touching Intercom (`--dry-run`)
- **Conflict detection** – Warns if someone edited an article on Intercom after your last pull
- **New articles** – Create articles locally and push them to Intercom as new entries
- **YAML Frontmatter** – Article metadata stored in each file (title, state, description, etc.)
- **Rate Limiting** – Automatic retry with backoff on API rate limits

## Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure API Access

Copy `.env.example` to `.env` and add your Intercom access token:

```bash
cp .env.example .env
```

Edit `.env`:

```
INTERCOM_ACCESS_TOKEN=your_access_token_here
```

For EU or AU workspaces, also set:

```
INTERCOM_SERVER=https://api.eu.intercom.io
```

### 3. Pull Articles

Fetch all articles from Intercom:

```bash
yarn pull --all
```

Pull and remove local files that no longer exist on Intercom:

```bash
yarn pull --all --clean
```

Pull a single article by ID:

```bash
yarn pull --id 123456
```

Or run interactively (prompts for options):

```bash
yarn pull
yarn push
```

### 4. Edit Locally

Articles are saved as Markdown files in the `articles/` folder, organized by Collection and Section:

```
articles/
├── getting-started/
│   ├── 12345-how-to-sign-up.md
│   └── 12346-first-steps.md
├── billing/
│   ├── invoices/
│   │   └── 12347-view-your-invoices.md
│   └── 12348-payment-methods.md
└── _uncategorized/
    └── 12349-standalone-article.md
```

Each file has YAML frontmatter with metadata:

```yaml
---
title: "How to Sign Up"
intercom_id: "12345"
workspace_id: "abc123"
state: published
default_locale: en
parent_type: collection
parent_id: "67890"
updated_at: 1700000000
description: "Step-by-step guide to creating your account."
url: "https://support.example.com/en/articles/12345-how-to-sign-up"
---

# How to Sign Up

Your article content here...
```

You can edit the `state` field to switch an article between `published` and `draft`.

### 5. Push Changes

Push only the articles you changed (default behavior):

```bash
yarn push --all
```

Preview what would be pushed without making changes:

```bash
yarn push --all --dry-run
```

Force push all articles regardless of changes (also skips conflict detection):

```bash
yarn push --all --force
```

Push a single article:

```bash
yarn push --id 123456
```

### 6. Create New Articles

Create a new `.md` file anywhere in `articles/` with minimal frontmatter:

```yaml
---
title: "My New Article"
state: draft
---

Article content goes here...
```

The `intercom_id` and other metadata will be filled in automatically after pushing. New articles are included in `yarn push --all` alongside changed existing articles.

## Workflow

1. **Pull** the latest articles from Intercom (`yarn pull --all`)
2. **Edit** articles locally in your editor
3. **Dry run** with `yarn push --all --dry-run` to review before pushing
4. **Push** changes back to Intercom (`yarn push --all`)

> **Note:** `articles/` and `data/` are gitignored. Always pull fresh from Intercom before editing.

## Project Structure

```
edge-article-audit/
├── articles/           # Markdown files, gitignored (pull before editing)
├── data/               # Raw JSON from API + pull manifest, gitignored
├── src/
│   ├── api/            # Intercom API client
│   ├── commands/       # CLI commands (pull, push)
│   ├── converters/     # HTML ↔ Markdown conversion
│   ├── utils/          # File operations, helpers
│   ├── config.ts       # Configuration loader
│   └── index.ts        # CLI entry point
├── .env.example        # Environment variable template
└── package.json
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `INTERCOM_ACCESS_TOKEN` | Yes | – | Your Intercom API access token |
| `INTERCOM_SERVER` | No | `https://api.intercom.io` | API server (EU: `https://api.eu.intercom.io`, AU: `https://api.au.intercom.io`) |
| `INTERCOM_VERSION` | No | `2.14` | Intercom API version |
| `INTERCOM_DEFAULT_LOCALE` | No | `en` | Default locale for articles |

## Development

```bash
# Run in development mode
yarn dev pull --all

# Lint code
yarn lint

# Fix lint issues
yarn fix

# Build for production
yarn build
```

## Conversion Notes

- **HTML → Markdown**: Uses Turndown. Preserves headings, lists, links, images, bold/italic.
- **Tables and videos**: Kept as raw HTML blocks (no Markdown equivalent).
- **Markdown → HTML**: Uses Marked. Generates clean HTML for Intercom.

## Safety

- **Change detection**: Only changed articles are pushed by default
- **Conflict detection**: Warns before overwriting articles that were edited on Intercom after your last pull
- **Dry run**: Preview changes before pushing with `--dry-run`
- **Raw JSON backup**: API responses cached in `data/` for reference
- **Clean sync**: Optional orphan removal keeps local state tidy (`--clean`)
