import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./Map'), {
    ssr: false,
});

export { DynamicMap };
