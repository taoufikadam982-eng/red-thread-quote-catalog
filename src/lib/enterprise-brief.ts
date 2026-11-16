export type EnterpriseBrief = {
  equipment: string[];
  sector: string;
  details: string;
  timing: string;
  requestType: 'Devis' | 'Bon de commande' | 'Marché';
};

export function formatEnterpriseBrief(brief: EnterpriseBrief) {
  return [
    `Secteur : ${brief.sector || 'Non précisé'}`,
    `Équipements : ${brief.equipment.join(', ')}`,
    `Type de demande : ${brief.requestType}`,
    `Échéance souhaitée : ${brief.timing || 'À convenir'}`,
    '',
    brief.details.trim(),
  ].join('\n');
}