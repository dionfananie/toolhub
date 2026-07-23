import { useEffect, useRef } from "react";
import ToolCard from "~/components/tool-card";
import useIntersect from "~/hooks/useIntersect";

function CurrencyIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12c0-1.1.9-2 2-2h4a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2" />
            <path d="M12 6v2m0 8v2" />
        </svg>
    );
}

const Intersect = () => {
    const lastRef = useRef<HTMLDivElement>(null)

    const observeElement = () => {
        if (!lastRef.current) return
        if (typeof window !== "undefined" && "IntersectionObserver" in window) {
            const intersect = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) console.log('visible on screen!');

                })
            })

            intersect.observe(lastRef.current)

        }
    }

    const intersectRef = useIntersect(() => {
        console.log('callback ni');
    })
    const list = new Array(20).fill({
        id: Math.floor(Math.random() * 100),
        name: "Financial",
        path: '',
        description: `Item `,
        icon: <CurrencyIcon />,
    },)

    const last = {
        id: 9999,
        name: "LAST",
        path: '',
        description: `Item `,
        to: "",
        icon: <CurrencyIcon />,
    }


    useEffect(() => {
        observeElement()
    }, [])
    return (
        <>
            {list.map((item, key) => (
                <div key={key}>
                    <ToolCard {...item} />
                </div>
            ))}
            <div ref={intersectRef}>

                <ToolCard {...last} />
            </div>
        </>);
}

export default Intersect;