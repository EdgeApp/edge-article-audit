import { marked } from 'marked'

// Configure marked for Intercom-compatible HTML output
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: false, // Don't convert \n to <br>
  async: false
})

/**
 * Convert Markdown content to HTML
 */
export function markdownToHtml(markdown: string): string {
  if (markdown == null || markdown.trim() === '') {
    return ''
  }

  // Parse markdown to HTML
  const html = marked.parse(markdown, { async: false }) as string

  // Post-process for Intercom compatibility
  return (
    html
      .trim()
      // Ensure self-closing tags are properly formatted
      .replace(/<br>/g, '<br />')
      .replace(/<hr>/g, '<hr />')
      // Add no-margin class to <p> tags inside list items (Intercom convention)
      .replace(/<li><p>/g, '<li><p class="no-margin">')
      // Collapse newlines within list structures only, to prevent Intercom
      // from interpreting whitespace as extra spacing before/between list items
      .replace(/>\n+(<\/?(?:ul|ol|li))/g, '>$1')
      .replace(/(<\/(?:li|ul|ol)>)\n+</g, '$1<')
  )
}
