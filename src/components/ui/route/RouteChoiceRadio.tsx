import { Button, ButtonGroup } from '@heroui/react';
import { ReactElement, useState } from 'react';

interface Props {
    priority: string;
    setPriority: (priority: string) => void;
    routeCosts: { cheapest: number; shortest: number; hybrid: number };
    // costWeight: number;
    // setCostWeight: (value: number) => void;
    // distanceWeight: number;
    // setDistanceWeight: (value: number) => void;
}

export default function RouteChoiceRadio({
    priority,
    setPriority,
    routeCosts,
}: Props): ReactElement {
    const [costWeight, setCostWeight] = useState(() => {
        return parseFloat(localStorage.getItem('costWeight') || '0.5');
    });
    const [distanceWeight, setDistanceWeight] = useState(() => {
        return parseFloat(localStorage.getItem('distanceWeight') || '0.5');
    });
    const [tempCostWeight, setTempCostWeight] = useState(costWeight);
    const [tempDistanceWeight, setTempDistanceWeight] = useState(distanceWeight);

    const applyChanges = () => {
        localStorage.setItem('costWeight', tempCostWeight.toString());
        localStorage.setItem('distanceWeight', tempDistanceWeight.toString());

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
                        <Button color='primary' onPress={applyChanges}>Spara</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
