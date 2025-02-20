import React from 'react';
import { StoreInventory } from '~/models/v1';

interface ShoppingRouteProps {
    route: StoreInventory[];
}

const ShoppingRoute: React.FC<ShoppingRouteProps> = ({ route }) => {
    return (
        <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-2">🛒 Shopping Route</h3>
            <ol className="list-decimal list-inside">
                {route.map((store) => (
                    <li key={store.store.id} className="py-1">
                        <strong>{store.store.name}</strong>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ShoppingRoute;