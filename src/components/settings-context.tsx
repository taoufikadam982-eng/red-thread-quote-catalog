import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStorefrontSettings, type StorefrontSettings } from '@/lib/settings.functions';
import { defaultWhatsappNumber } from '@/lib/storefront';

export const storefrontSettingsQuery = { queryKey: ['storefront-settings'], queryFn: () => getStorefrontSettings(), staleTime: 0, refetchInterval: 3000 };

const fallback: StorefrontSettings = { whatsapp: defaultWhatsappNumber };
const SettingsContext = createContext<StorefrontSettings>(fallback);

export function StorefrontSettingsProvider({ children, initialData }: { children: ReactNode; initialData?: StorefrontSettings | undefined }) {
  const { data } = useQuery({ ...storefrontSettingsQuery, ...(initialData ? { initialData } : {}), throwOnError: false });
  return <SettingsContext.Provider value={data ?? fallback}>{children}</SettingsContext.Provider>;
}

export function useStorefrontSettings() {
  return useContext(SettingsContext);
}

// Empty string means the admin removed the line: every WhatsApp entry point hides.
export function useWhatsapp() {
  return useContext(SettingsContext).whatsapp;
}
