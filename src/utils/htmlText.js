/** Strip HTML tags for excerpts / plain previews. */
export function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptHtml(html, max = 160) {
  const plain = stripHtml(html);
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).trim()}…`;
}
