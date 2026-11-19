/** Browser-safe plain text for published catalogue fields; never renders HTML. */
export function productPlainText(value: string) {
  const entities: Record<string, string> = { nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', ccedil: 'ç', ocirc: 'ô', ugrave: 'ù', deg: '°' };
  let text = value;
  for (let pass = 0; pass < 3; pass++) {
    text = text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (original, entity: string) => {
      if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? original;
      const code = entity[1]?.toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    });
    text = text.replace(/<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
      .replace(/<\s*br\s*\/?\s*>|<\s*\/(?:p|li|tr|div|h[1-6])\s*>/gi, '\n')
      .replace(/<[^>]*>/g, '');
  }
  return text.replace(/[\t ]+/g, ' ').replace(/ *\n */g, '\n').trim();
}