import type { ReactElement, ReactNode } from 'react';
import TopNavbar from '~components/ui/navbar/TopNavbar';

type Props = {
    children: ReactNode;
};

export default function MainLayout({ children }: Props): ReactElement {
    return (
        <div className="min-h-screen bg-gray-100">
            <TopNavbar />
            <div>{children}</div>
        </div>
    );
}
