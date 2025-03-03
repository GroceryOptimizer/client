import React, { useEffect, useState } from "react";

interface RouteChoiceRadioProps {
    priority: string;
    setPriority: (priority: string) => void;
    routeCosts: { cheapest: number, shortest: number, hybrid: number }
    costWeight: number;
    setCostWeight: (value: number) => void;
    distanceWeight: number;
    setDistanceWeight: (value: number) => void;
}

const RouteChoiceRadio: React.FC<RouteChoiceRadioProps> = ({ priority, setPriority, routeCosts, costWeight, setCostWeight, distanceWeight, setDistanceWeight }) => {
    // const [costWeight, setCostWeight] = useState(() => {
    //     return parseFloat(localStorage.getItem("costWeight") || "0.5");
    // });
    // const [distanceWeight, setDistanceWeight] = useState(() => {
    //     return parseFloat(localStorage.getItem("distanceWeight") || "0.5");
    // });
    const [tempCostWeight, setTempCostWeight] = useState(costWeight);
    const [tempDistanceWeight, setTempDistanceWeight] = useState(distanceWeight);

    const applyChanges = () => {
        localStorage.setItem("costWeight", tempCostWeight.toString());
        localStorage.setItem("distanceWeight", tempDistanceWeight.toString());

        setCostWeight(tempCostWeight);
        setDistanceWeight(tempDistanceWeight);
    }

    return (
        <div className="bg-slate-100 rounded-lg shadow-md p-4">
            <h3 className="text-lg mb-2">Select Route Optimization Priority:</h3>

            <div className="flex items-start gap-6">
                <div className="flex gap-4">
                    <label className="flex gap-2 items-center">
                        <input
                            type="radio"
                            name="priority"
                            value="cheapest"
                            checked={priority === "cheapest"}
                            onChange={() => setPriority("cheapest")}
                        />
                        <div>
                            <span>Cheapest Total</span>
                            <div>Cost: {routeCosts.cheapest} SEK</div>
                        </div>
                    </label>

                    <label className="flex gap-2 items-center">
                        <input
                            type="radio"
                            name="priority"
                            value="shortest"
                            checked={priority === "shortest"}
                            onChange={() => setPriority("shortest")}
                        />
                        <div>
                            <span>Shortest Distance</span>
                            <div>Cost: {routeCosts.shortest} SEK</div>
                        </div>
                    </label>

                    <label className="flex gap-2 items-center">
                        <input
                            type="radio"
                            name="priority"
                            value="hybrid"
                            checked={priority === "hybrid"}
                            onChange={() => setPriority("hybrid")}
                        />
                        <div>
                            <span>Hybrid Selection</span>
                            <div>Cost: {routeCosts.hybrid} SEK</div>
                        </div>
                    </label>
                </div>

                {priority === "hybrid" && (
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
                            <strong>Cost Weight:</strong> {tempCostWeight.toFixed(1)} | <strong>Distance Weight:</strong> {tempDistanceWeight.toFixed(1)}
                        </div>
                        <div className="buttonDiv">
                            <button onClick={applyChanges} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2">Apply</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RouteChoiceRadio;