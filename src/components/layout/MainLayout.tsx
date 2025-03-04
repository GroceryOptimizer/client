'use client';

import type { ReactElement, ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export default function MainLayout({ children }: Props): ReactElement {
    return (
        <div>
            <h1>Hello World</h1>
            <p>This is a test</p>
        </div>
    );
}
