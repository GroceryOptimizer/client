import React from "react";

interface RouteChoiceRadioProps {
    priority: string;
    setPriority: (priority: string) => void;
}

const RouteChoiceRadio: React.FC<RouteChoiceRadioProps> = ({ priority, setPriority }) => {
    return (
        <div className="bg-slate-100 rounded-lg shadow-md p-4">
            <h3 className="text-lg mb-2">Select Route Optimization Priority:</h3>
            <div className="flex flex gap-2">
                <label>
                    <input
                        type="radio"
                        name="priority"
                        value="cheapest"
                        checked={priority === "cheapest"}
                        onChange={() => setPriority("cheapest")}
                    />
                    Cheapest Total
                </label>
                <label>
                    <input
                        type="radio"
                        name="priority"
                        value="shortest"
                        checked={priority === "shortest"}
                        onChange={() => setPriority("shortest")}
                    />
                    Shortest Distance
                </label>
                <label>
                    <input
                        type="radio"
                        name="priority"
                        value="hybrid"
                        checked={priority === "hybrid"}
                        onChange={() => setPriority("hybrid")}
                    />
                    Hybrid Selection
                </label>
            </div>
        </div>
    );
};

export default RouteChoiceRadio;