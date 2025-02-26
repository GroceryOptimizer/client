import React from "react";

interface RouteChoiceRadioProps {
    priority: string;
    setPriority: (priority: string) => void;
    routeCosts: { cheapest: number, shortest: number, hybrid: number }
}

const RouteChoiceRadio: React.FC<RouteChoiceRadioProps> = ({ priority, setPriority, routeCosts }) => {
    return (
        <div className="bg-slate-100 rounded-lg shadow-md p-4">
            <h3 className="text-lg mb-2">Select Route Optimization Priority:</h3>
            <div className="flex flex gap-2">
                <label className="flex gap-2">
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
                <label className="flex gap-2">
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
                <label className="flex gap-2">
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
        </div>
    );
};

export default RouteChoiceRadio;