import type { Product } from './catalog';
import { assignedCategories } from './product-categories';
import { productPlainText } from './product-text';

/** Extract only published technical facts; never split prose on decimal commas. */
export function extractProductSpecPills(product: Product): string[] {
  const detail = productPlainText(product.detail).replace(/\u00a0/g, ' ');
  const text = `${detail}\n${productPlainText(product.name)}`;
  const categories = assignedCategories(product);
  const monitor = categories.includes('Écrans');
  const printer = categories.some(category => ['Imprimantes', 'Scanners'].includes(category)) || /\b(?:ppm|ipm|laser|jet d.encre)\b/i.test(detail);
  const first = (pattern: RegExp) => text.match(pattern);
  const compact = (value: string) => value.replace(/\s+/g, ' ').trim();
  const clean = (values: (string | undefined)[]) => [...new Set(values.filter((value): value is string => Boolean(value)).map(compact).filter(value => value.length <= 24))].slice(0, 4);

  const diagonal = first(/\b(\d{1,2}(?:[.,]\d{1,2})?)\s*(?:pouces?\b|inches?\b|["″”]|''|po\b)/i);
  const size = diagonal ? `${diagonal[1]?.replace('.', ',')}"` : undefined;
  const displayText = text.split(/\n|;|·/).filter(row => !/graphis|graphics|webcam|cam[eé]ra|HDMI|DisplayPort/i.test(row)).join('\n');
  const resolutionMatch = displayText.match(/\b(3840\s*[x×]\s*2160|2560\s*[x×]\s*1440|1920\s*[x×]\s*1200|1920\s*[x×]\s*1080|4K|UHD|QHD|WQHD|WUXGA|FHD|Full\s*HD|HD)\b/i)
    ?? (monitor ? first(/\b(3840\s*[x×]\s*2160|2560\s*[x×]\s*1440|1920\s*[x×]\s*1200|1920\s*[x×]\s*1080|4K|UHD|QHD|WQHD|WUXGA|FHD|Full\s*HD|HD)\b/i) : null);
  const rawResolution = resolutionMatch?.[1]?.replace(/\s+/g, '').toUpperCase();
  const resolution = rawResolution ? /3840|4K|UHD/.test(rawResolution) ? '4K' : /2560|QHD/.test(rawResolution) ? 'QHD' : /1200|WUXGA/.test(rawResolution) ? 'WUXGA' : /1080|FHD|FULLHD/.test(rawResolution) ? 'Full HD' : 'HD' : undefined;
  const screen = [size, resolution].filter(Boolean).join(' ') || undefined;
  const ports = [
    /\bHDMI\b/i.test(text) ? 'HDMI' : undefined,
    /\b(?:Display\s*Port|DP)\b/i.test(text) ? 'DP' : undefined,
    /\bVGA\b/i.test(text) ? 'VGA' : undefined,
    /\bUSB\s*[- ]?C\b/i.test(text) ? 'USB-C' : undefined,
  ].filter((value): value is string => Boolean(value));
  // Keep complete port names when the full group would exceed the pill limit.
  const portGroups: string[] = [];
  for (const port of ports) {
    const last = portGroups.at(-1);
    if (last && `${last} · ${port}`.length <= 24) portGroups[portGroups.length - 1] = `${last} · ${port}`;
    else portGroups.push(port);
  }
  if (monitor) {
    const panel = first(/\b(IPS|VA|TN|OLED)\b/i)?.[1]?.toUpperCase();
    const hz = first(/\b(\d{2,3}(?:[.,]\d+)?)\s*Hz\b/i)?.[1];
    return clean([screen, [panel ? `Dalle ${panel}` : undefined, hz ? `${hz} Hz` : undefined].filter(Boolean).join(' · '), ...portGroups]);
  }
  if (printer) {
    const laser = /\blaser\b/i.test(text);
    const ink = /\bjet d[’']?\s*encre\b/i.test(text);
    const mono = /\b(?:monochrome|mono|noir et blanc)\b/i.test(text);
    const color = /\bcouleur\b/i.test(text);
    const type = laser ? `Laser${mono ? ' Monochrome' : color ? ' Couleur' : ''}` : ink ? `Jet d’encre${color ? ' Couleur' : ''}` : /\bscanner\b/i.test(text) ? 'Scanner' : undefined;
    const speed = first(/\b(\d+(?:[.,]\d+)?)\s*(ppm|ipm|pages?\s*(?:\/|par)\s*min(?:ute)?s?)\b/i);
    const connections = [
      /\bUSB\b/i.test(text) ? 'USB' : undefined,
      /\b(?:Ethernet|r[eé]seau|RJ[- ]?45)\b/i.test(text) ? 'Réseau' : undefined,
      /\bwi[- ]?fi\b/i.test(text) ? 'Wi-Fi' : undefined,
    ].filter(Boolean).join(' · ') || undefined;
    const duplex = /\b(?:recto[- ]verso|duplex)\b(?!\s*:\s*(?:non|sans))/i.test(text) && !/\b(?:sans|pas de)\s+(?:recto[- ]verso|duplex)/i.test(text) ? 'Recto-Verso' : undefined;
    const combined = [connections, duplex].filter(Boolean).join(' · ');
    return clean([type, speed ? `${speed[1]} ${speed[2]?.toLowerCase() === 'ipm' ? 'ipm' : 'ppm'}` : undefined, ...(combined.length <= 24 ? [combined] : [connections, duplex])]);
  }

  const cpuMatch = first(/\b(?:Intel\s+)?Core\s+(?:(?:Ultra\s+)?[3579]|i[3579])(?:\s*[- ]\s*\d{3,5}[A-Z]{0,3})?\b|\b(?:AMD\s+)?Ryzen\s+[3579](?:\s+(?:PRO\s+)?\d{4}[A-Z]{0,3})?\b|\b(?:Apple\s+)?M[1-9](?:\s+(?:Pro|Max|Ultra))?\b|\b(?:Intel\s+)?(?:Xeon|Celeron|Pentium)(?:\s+[A-Z]?\d{3,5}[A-Z]{0,2})?\b/i);
  let cpu = cpuMatch ? compact(cpuMatch[0]).replace(/\s*-\s*/g, '-') : undefined;
  if (cpu && cpu.length > 24) cpu = cpu.replace(/^(?:Intel|AMD)\s+/i, '');
  const ramMatch = first(/\b(\d+)\s*(Go|GB)\s*(?:(?:de\s+)?RAM\s+)?(DDR[345](?:\s*[- ]\s*\d{4})?|LPDDR[345]X?)\b/i)
    ?? first(/(?:m[eé]moire|\bRAM)\s*[:\-]?\s*(\d+)\s*(Go|GB)\b/i);
  const ram = ramMatch ? `${ramMatch[1]} Go${ramMatch[3] ? ` ${ramMatch[3].toUpperCase().replace(/\s*-\s*/g, '-')}` : ''}` : undefined;
  const storageMatch = first(/\b(\d+(?:[.,]\d+)?)\s*(Go|GB|To|TB)\s*(?:(?:PCIe|NVMe|M\.2|SATA)\s*)*(SSD|HDD)\b/i)
    ?? first(/\b(SSD|HDD)\s*[:\-]?\s*(\d+(?:[.,]\d+)?)\s*(Go|GB|To|TB)\b/i);
  const reversed = storageMatch && /^(SSD|HDD)$/i.test(storageMatch[1] ?? '');
  const storageAmount = reversed ? storageMatch?.[2] : storageMatch?.[1];
  const storageUnit = reversed ? storageMatch?.[3] : storageMatch?.[2];
  const storageKind = reversed ? storageMatch?.[1] : storageMatch?.[3];
  const disk = first(/\bdisque dur\s*(?:de\s*)?[:\-]?\s*(\d+(?:[.,]\d+)?)\s*(Go|GB|To|TB)\b/i);
  const storage = storageMatch ? `${storageAmount} ${/^(To|TB)$/i.test(storageUnit ?? '') ? 'To' : 'Go'} ${storageKind?.toUpperCase()}` : disk ? `${disk[1]} ${/^(To|TB)$/i.test(disk[2] ?? '') ? 'To' : 'Go'} HDD` : undefined;
  return clean([cpu, ram, storage, screen, ...portGroups]);
}