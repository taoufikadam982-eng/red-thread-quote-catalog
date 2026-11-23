// Query every batch before building XML: a later failure must never yield partial success.
export async function allSitemapRows<T>(readPage: (from: number, to: number) => Promise<{ data: T[] | null; error: unknown }>, pageSize = 1000): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ;) {
    const { data, error } = await readPage(offset, offset + pageSize - 1);
    if (error) throw error;
    if (!data) throw new Error('Sitemap source unavailable');
    if (!data.length) return rows;
    rows.push(...data);
    offset += data.length;
  }
}