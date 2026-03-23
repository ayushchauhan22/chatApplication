import React, { useState, useRef, useEffect } from "react";

function Stopwatch() {
    const [isRunning, setIsRunning] = useState(false);

    const secondsRef = useRef(0); 
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [, forceRender] = useState(0); 

    const handleStart = () => {
        if (!isRunning) {
            setIsRunning(true);

            intervalRef.current = setInterval(() => {
                secondsRef.current += 1;

                // force UI update
                forceRender((prev) => prev + 1);
            }, 100);
        }
    };

    const handleStop = () => {
        setIsRunning(false);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);


    const hrs = Math.floor(secondsRef.current / 3600);
    const mins = Math.floor((secondsRef.current % 3600) / 60);
    const secs = secondsRef.current % 60;
    const format = (value: number) => value.toString().padStart(2, "0");

    return (
        <div className="container">
            <h1>Stopwatch</h1>

            <div className="time">
                {format(hrs)} : {format(mins)} : {format(secs)}
            </div>

            <div className="buttons">
                <button onClick={handleStart}>Start</button>
                <button onClick={handleStop}>Stop</button>
            </div>
        </div>
    );
}

export default Stopwatch;