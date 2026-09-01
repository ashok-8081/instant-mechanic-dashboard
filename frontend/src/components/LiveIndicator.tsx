import React, { useState, useEffect } from 'react';
import { Circle } from 'lucide-react';

const LiveIndicator: React.FC = () => {
    const [isLive, setIsLive] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsLive(prev => !prev);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
            <Circle 
                className={`w-2 h-2 ${isLive ? 'text-green-500' : 'text-green-300'}`} 
                fill="currentColor"
            />
            <span className="text-xs font-medium text-green-700">Live</span>
        </div>
    );
};

export default LiveIndicator;