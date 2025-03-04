'use client';

import { HeroUIProvider } from '@heroui/react';
import { useEffect, useState, type ReactNode } from 'react';
import { getConfig, loadConfig } from '~config';

type Props = {
    children: ReactNode;
};

export default function Providers({ children }: Props) {
    const [configLoaded, setConfigLoaded] = useState(false);

    useEffect(() => {
        loadConfig()
            .catch((error) => console.error('Failed to load config', error))
            .finally(() => setConfigLoaded(true));
    }, []);

    return <HeroUIProvider>{children}</HeroUIProvider>;
}
