import { useEffect, useState } from "react";

export default function CountdownTool() {
    const [target, setTarget] = useState(0);

    console.log('target', target);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const processCountdown = () => {
        const date = new Date().getTime();
        const distance = new Date(target).getTime() - date
        console.log('distance', distance);
        console.log('con', new Date(target).getTime());


        if (distance < 0) {
            setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        console.log(days);
        const hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
        console.log(hours);
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        console.log(minutes);
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        console.log(seconds);
        setCountdown({ days, hours, minutes, seconds })

    }

    useEffect(() => {

        if (target === 0 || new Date(target).getTime() - new Date().getTime() <= 0) return;
        const timer = setInterval(() => {
            processCountdown();

        }, 1000);

        return () => {
            clearInterval(timer)
        }
    }, [processCountdown]);


    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto animate-fade-in pt-6">
            <h1>Countdown Tool</h1>
            <div className="">
                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Input target
                </label>
                <input id="price"
                    type="text"
                    name="price"
                    placeholder="Input target time"
                    onChange={v => setTarget(Number(v.target.value))}
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base border rounded text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />

            </div>
            <p>{`${countdown.days} Days:${countdown.hours} Hours: ${countdown.minutes} Minutes: ${countdown.seconds} Seconds`}</p>
        </div>
    );
}
