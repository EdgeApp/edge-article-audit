# Edge Article Audit – Product Requirements Document

## Overview

**Edge Article Audit** is a CLI tool for editing **Intercom Help Center** articles as Markdown instead of HTML.

**Problem:** Intercom's Articles API returns article content as HTML, which is cumbersome to edit.

**Solution:** Pull articles, convert to Markdown, edit locally, push back.

---

## MVP Requirements

### Core Workflow

1. **Pull** – Fetch articles from Intercom via API
2. **Convert** – Transform HTML → Markdown on fetch
3. **Edit** – Modify articles locally in Cursor (with Markdown preview) or external editor like MarkText
4. **Push** – Convert Markdown → HTML and sync back to Intercom

### Pull/Push Options
- All articles
- Single article by ID

CLI supports both flags (`--all`, `--id 123`) and interactive prompts if no flags provided.

### Local Storage
- Markdown files in a folder hierarchy mirroring Intercom Help Center structure (Collections, and optionally Sections)
- YAML frontmatter for metadata:
  ```yaml
  ---
  title: "How to Reset Your Password"
  intercom_id: "6871119"
  workspace_id: "hfi1bx4l"
  state: published # or draft
  default_locale: en
  parent_type: collection # or section, or null if standalone
  parent_id: "125685"
  ---
  ```

### Conversion
- Preserve headings, lists, links, images, bold/italic
- Keep tables/videos as HTML blocks if no Markdown equivalent
- Round-trip (HTML → MD → HTML) should preserve content structure

### Safety
- Local Markdown files serve as backup

---

## Technical Notes

### Stack
- TypeScript or JavaScript
- Node.js

### Intercom API Endpoints
- **Servers**
  - `https://api.intercom.io/` (default)
  - `https://api.eu.intercom.io/` (EU)
  - `https://api.au.intercom.io/` (AU)
- **Help Center**
  - `GET /help_center/help_centers` (list help centers)
  - `GET /help_center/collections` (list collections)
- **Articles**
  - `GET /articles` (list articles)
  - `GET /articles/{id}` (retrieve single article)
  - `PUT /articles/{id}` (update article)
  - `GET /articles/search` (search articles)

**Auth:** `Authorization: Bearer <INTERCOM_ACCESS_TOKEN>`

**Versioning header:** `Intercom-Version: 2.14` (or your chosen API version)

Pagination: cursor-based pages (plan for `next` cursor / `per_page` when iterating).

Rate limiting: handle `429` with retry/backoff; implement batching for large pulls.

### Image Handling
- Intercom-hosted image URLs preserved in Markdown (as present in the article HTML)
- New images: manual upload (or via whatever workflow you use), then insert URL

### Internal Links
- Prefer using the canonical `url` returned by the Intercom Articles API for internal links.
- (Optional) When converting HTML → MD, preserve existing Intercom article links; avoid rewriting unless you have a stable mapping.

---

## Future Phases

### Phase 2: Audit Tools
- **Broken link checker** – HTTP check external links, verify internal links against local files
- **Outdated content detection** – Flag articles not updated in X months, scan for deprecated terms
- **Duplicate detection** – Hash comparison for repeated paragraphs across articles
- **Glossary enforcement** – Scan for incorrect brand/product names

### Phase 3: Enhanced Workflow
- Dry-run mode for push (preview diff before publishing)
- Git integration with auto-commit before push
- Version control UI / PR workflows
- Preview environment mimicking Intercom Help Center rendering
- Analytics integration (flag low-satisfaction articles)

### Phase 4: Scale & Collaboration
- Multi-language support
- Real-time collaboration
- Standalone GUI for non-IDE users

### Potential Tools
| Purpose | Options |
|---------|---------|
| HTML → Markdown | Turndown |
| Markdown → HTML | Showdown, Marked |
| YAML frontmatter | gray-matter |
| CLI | Commander.js, Inquirer.js |
| HTTP | Axios, node-fetch |
| File ops | fs-extra |
| Terminal styling | Chalk, Ora |

---

## Implementation Notes

- **Config:** Use environment variable `INTERCOM_ACCESS_TOKEN` (recommended) and optionally `INTERCOM_VERSION` + `INTERCOM_SERVER` (for EU/AU)
- **Push output:** Print live Intercom article URL after successful push for verification
