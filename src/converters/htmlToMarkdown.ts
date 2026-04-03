import TurndownService from 'turndown'

// Create a configured Turndown instance
const turndown = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined'
})

// Keep tables as HTML (no good markdown equivalent for complex tables)
turndown.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td'])

// Keep video/iframe elements as HTML
turndown.keep(['video', 'iframe', 'source'])

// Custom rule for Intercom-specific elements
turndown.addRule('intercomDiv', {
  filter: node => {
    return (
      node.nodeName === 'DIV' &&
      node.getAttribute('data-identifyelement') != null
    )
  },
  replacement: content => {
    // Strip the wrapper div but keep the content
    return content + '\n\n'
  }
})

// Custom rule for preserving image attributes
turndown.addRule('images', {
  filter: 'img',
  replacement: (content, node) => {
    const img = node as HTMLImageElement
    const alt = img.getAttribute('alt') ?? ''
    const src = img.getAttribute('src') ?? ''
    const title = img.getAttribute('title')

    if (src === '') return ''

    if (title != null && title !== '') {
      return `![${alt}](${src} "${title}")`
    }
    return `![${alt}](${src})`
  }
})

/**
 * Convert HTML content to Markdown
 */
export function htmlToMarkdown(html: string): string {
  if (html == null || html.trim() === '') {
    return ''
  }

  // Pre-process: normalize whitespace in inline elements
  const processed = html
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Restore newlines before block elements
    .replace(/<(p|div|h[1-6]|ul|ol|li|blockquote|pre|table|tr)/gi, '\n<$1')
    // Restore newlines after closing block elements
    .replace(/<\/(p|div|h[1-6]|ul|ol|li|blockquote|pre|table|tr)>/gi, '</$1>\n')

  const markdown = turndown.turndown(processed)

  // Post-process: clean up extra newlines
  return markdown
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .trim()
}
