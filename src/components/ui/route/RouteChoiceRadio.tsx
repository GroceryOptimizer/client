'use client';

import { Button, ButtonGroup } from '@heroui/react';
import { ReactElement, useState } from 'react';
import { persist } from 'zustand/middleware';
import { create } from 'zustand/react';

interface RouteConfigStore {
    costWeight: number;
    distanceWeight: number;
    setCostWeight: (value: number) => void;
    setDistanceWeight: (value: number) => void;
}

export const useRouteConfigStore = create<RouteConfigStore>()(
    persist(
        (set) => ({
            costWeight: 0.5,
            distanceWeight: 0.5,
            setCostWeight: (costWeight) => set({ costWeight }),
            setDistanceWeight: (distanceWeight) => set({ distanceWeight }),
        }),
        { name: 'route-config-store' }
    )
);

interface Props {
    priority: string;
    routeCosts: { cheapest: number; shortest: number; hybrid: number };
    setPriority: (priority: string) => void;
}

export function RouteChoiceRadio({ priority, routeCosts, setPriority }: Props): ReactElement {
    const { costWeight, distanceWeight, setCostWeight, setDistanceWeight } = useRouteConfigStore();
    const [tempCostWeight, setTempCostWeight] = useState(costWeight);
    const [tempDistanceWeight, setTempDistanceWeight] = useState(distanceWeight);

    const applyChanges = () => {
        setCostWeight(tempCostWeight);
        setDistanceWeight(tempDistanceWeight);
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <ButtonGroup fullWidth className="flex items-center">
                <Button
                    color="primary"
                    variant={priority === 'cheapest' ? 'faded' : 'solid'}
                    onPress={() => setPriority('cheapest')}
                >
                    Billigast
                </Button>
                <Button
                    color="primary"
                    variant={priority === 'shortest' ? 'faded' : 'solid'}
                    onPress={() => setPriority('shortest')}
                >
                    Kortast
                </Button>
                <Button
                    color="primary"
                    variant={priority === 'hybrid' ? 'faded' : 'solid'}
                    onPress={() => setPriority('hybrid')}
                >
                    Hybrid
                </Button>
            </ButtonGroup>

            {priority === 'hybrid' && (
                <div className="flex flex-col items-center gap-3 p-3 bg-gray-100 rounded-md shadow-md">
                    <label className="text-sm font-medium">Cost vs Distance</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={tempCostWeight}
                        onChange={(e) => {
                            const newCostWeight = parseFloat(e.target.value);
                            setTempCostWeight(newCostWeight);
                            setTempDistanceWeight(1 - newCostWeight);
                        }}
                        className="w-3/4"
                    />
                    <div className="flex justify-between w-3/4 text-xs">
                        <span>Distance Priority</span>
                        <span>Cost Priority</span>
                    </div>
                    <div className="text-sm">
                        <strong>Cost Weight:</strong> {tempCostWeight.toFixed(1)} |{' '}
                        <strong>Distance Weight:</strong> {tempDistanceWeight.toFixed(1)}
                    </div>
                    <div className="buttonDiv">
                        <Button color="primary" onPress={applyChanges}>
                            Spara
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
