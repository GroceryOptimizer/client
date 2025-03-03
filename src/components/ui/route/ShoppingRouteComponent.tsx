import { type ReactElement } from 'react';
import { StoreInventory } from '~models';
import { ShoppingCart as CartIcon } from 'lucide-react';
import { Accordion, AccordionItem } from '@heroui/react';

interface Props {
    route: StoreInventory[];
}

export default function ShoppingRoute({ route }: Props): ReactElement {
    const defaultExpandedKeys = route.map((_, i) => String(i + 1));
    return (
        <div className="bg-white p-4 rounded-b-md">
            <div className="flex flex-row gap-4">
                <CartIcon /> <h3 className="text-xl font-semibold mb-2">Butiker</h3>
            </div>
            <div className="max-h-[calc(100vh-24rem)] overflow-y-auto scrollbar">
                <Accordion selectionMode="multiple" defaultExpandedKeys={defaultExpandedKeys}>
                    {route.map((s, si) => (
                        <AccordionItem key={si} title={s.store.name}>
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
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
