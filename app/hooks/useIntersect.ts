import { useEffect, useRef } from "react"


const useIntersect = (cb: () => void, options?: IntersectionObserverInit) => {

    const ref = useRef(null);

    useEffect(() => {
        if (window && window.IntersectionObserver) {
            const recentRef = ref.current;
            if (!recentRef) return;
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        cb();
                        console.log('intersecting');

                    }
                })
            }, options)

            return () => observer.observe(recentRef)
        }
    }, [])

    return ref;

}

export default useIntersect