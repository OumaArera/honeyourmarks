import { useState, useEffect, useRef } from "react";


export default function Counter({ target }) {
  const [count, setCount]   = useState(0);
  const ref                  = useRef(null);
  const started              = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const num   = parseInt(target.replace(/\D/g, ""), 10);
      const steps = 60;
      const inc   = num / steps;
      let cur     = 0;
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= num) { setCount(num); clearInterval(timer); }
        else setCount(Math.floor(cur));
      }, 1800 / steps);
    }, { threshold: 0.5 });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  const suffix = target.includes("+") ? "+" : target.includes("%") ? "%" : "";
  return <span ref={ref}>{count}{suffix}</span>;
}