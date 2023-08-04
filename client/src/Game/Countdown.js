import './Canvas.css';
import { useEffect, useState } from "react";

const Countdown = () => {
    // ---- Countdown
    const [count, setCount] = useState(5);
    useEffect(() => {

        const timer = setInterval(() => {
            console.log(count);
            if (count <= 0) {
                clearInterval(timer);
                setCount(0);
            } else{
                setCount((prevCount) => prevCount - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [count]);

    // useEffect(() => {
    //     if (count === 0) {
    //         setTimeout(() => {
    //             setCount(5);
    //         }, 1000);
    //     }
    // }, [count]);

    return (
        <div>
            <h1 className="countdown">{count === 0 ? 'START' : count}</h1>
        </div>
    )
}

export default Countdown;