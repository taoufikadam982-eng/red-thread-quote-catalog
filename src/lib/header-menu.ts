import { Laptop, Monitor, Cpu, Printer, ScanLine, Network, BatteryCharging, Mouse, PanelsTopLeft } from 'lucide-react';

export const mainMenu = [
  { to: '/', label: 'Accueil' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/solutions', label: 'Entreprises & Marchés' },
  { to: '/marques', label: 'Nos Marques' },
  { to: '/blog', label: 'Blog' },
  { to: '/magasin', label: 'Notre Magasin' },
  { to: '/contact', label: 'Contact' },
] as const;
export const menuIcons = [Laptop, PanelsTopLeft, Cpu, Printer, ScanLine, Monitor, Network, BatteryCharging, Mouse, PanelsTopLeft];
export const featuredBrands = ['HP', 'Dell', 'Lenovo', 'ASUS', 'Epson', 'Eaton', 'ADATA'];