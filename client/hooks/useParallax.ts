import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed: number = 0.5,
  options?: { start?: string; end?: string }
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: 100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: options?.start || 'top center',
        end: options?.end || 'bottom center',
        scrub: 1,
        markers: false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [speed, options]);

  return ref;
}
