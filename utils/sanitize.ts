/**
 * Utilitas sanitasi input teks untuk mencegah serangan Cross-Site Scripting (XSS)
 * pada rendering preview kwitansi.
 */
export function sanitizeText(input: unknown): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function cleanPlainInput(input: unknown): string {
  if (input === null || input === undefined) return '';
  return String(input).trim();
}
