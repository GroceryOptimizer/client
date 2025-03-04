'use client';

import { type ReactElement } from 'react';
import { StockItem, StoreInventory } from '~models';
import { ShoppingCart as CartIcon } from 'lucide-react';
import { Accordion, AccordionItem } from '@heroui/react';

const storeLogoMap: StoreLogoMap = {
    coop: '/logo/coop_logo.svg',
    ica: '/logo/ica_logo.svg',
    willys: '/logo/willys_logo.svg',
    lidl: '/logo/lidl_logo.svg',
};

function calcTotalCost(route: StoreInventory[]): number {
    return route.reduce((total, storeInventory) => {
        return (
            total +
            storeInventory.inventory.reduce((storeTotal, stockItem) => {
                return storeTotal + stockItem.price;
            }, 0)
        );
    }, 0);
}

function calcStoreCost(inventory: StockItem[]): number {
    return inventory.reduce((total, stockItem) => {
        return total + stockItem.price;
    }, 0);
}

function getStoreLogo(storeName: string): string | undefined {
    const lowerCaseName = storeName.toLowerCase();
    for (const key in storeLogoMap) {
        if (lowerCaseName.includes(key)) {
            return storeLogoMap[key];
        }
    }
    return undefined;
}

interface StoreLogoMap {
    [key: string]: string;
}

interface Props {
    route: StoreInventory[];
}

export function ShoppingRoute({ route }: Props): ReactElement {
    const defaultExpandedKeys = route.map((_, i) => String(i + 1));
    const totalCost = calcTotalCost(route);

    return (
        <div className="bg-white p-4 rounded-b-md">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CartIcon />
                    <h3 className="text-xl font-semibold mb-0">Butiker</h3>
                </div>
                <div className="text-sm font-bold">{totalCost} kr</div>
            </div>
            <div className="max-h-[calc(100vh-24rem)] overflow-y-auto scrollbar">
                <Accordion selectionMode="multiple" defaultExpandedKeys={defaultExpandedKeys}>
                    {route.map((s, si) => {
                        const storeLogo = getStoreLogo(s.store.name);
                        return (
                            <AccordionItem
                                key={si}
                                startContent={
                                    storeLogo && (
                                        <img
                                            src={storeLogo}
                                            alt={`${s.store.name} logo`}
                                            className="h-4 w-20 object-contain"
                                        />
                                    )
                                }
                                title={s.store.name}
                                subtitle={calcStoreCost(s.inventory) + 'kr'}
                            >
                                <div className="flex flex-col gap-2">
                                    {s.inventory.map((p, pi) => (
                                        <div key={pi} className="flex items-center gap-4">
                                            <img
                                                src={p.product.image}
                                                alt={p.product.name}
                                                className="w-8 h-8 object-cover"
                                            />

                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold">
                                                    {p.product.name}
                                                </h3>
                                                <p className="text-xs text-gray-600">
                                                    {p.product.brand}
                                                </p>
                                            </div>

                                            <div className="text-sm font-bold">{p.price} kr</div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </div>
    );
}
