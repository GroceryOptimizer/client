'use client';

import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider, QueryFunction } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { getConfig, loadConfig } from '~config';

const hubFetcher = async ({ queryKey }: { queryKey: readonly unknown[] }, url: string) => {
  console.log('queryKey: ', queryKey);
  console.log('url: ', url);
  
  const endpoint = queryKey[0] as string;

  const res = await fetch(`${url}${endpoint}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

  return res.json();
};

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    loadConfig()
      .catch((error) => console.error("Failed to load config", error))
      .finally(() => setConfigLoaded(true));
  }, []);

  if (!configLoaded) return <div>Loading...</div>;

  const hubApiUrl = getConfig().API_BASE_URL || "";
  console.log("Hub API URL:", hubApiUrl);
  const hubQueryclient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: ({ queryKey }) => hubFetcher({ queryKey }, hubApiUrl),
        staleTime: 60000,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={hubQueryclient}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </QueryClientProvider>
  );
}
