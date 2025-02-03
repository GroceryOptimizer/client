'use client';

import type { ReactElement, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ProductGrid({ children }: Props): ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
}
