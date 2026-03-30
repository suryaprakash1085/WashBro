import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll('[data-reveal]');

    if (children.length > 0) {
      children.forEach((child, index) => {
        // Add initial styles
        (child as HTMLElement).style.opacity = '0';
        (child as HTMLElement).style.transform = 'translateY(30px)';

        // Get stagger class
        const classes = (child as HTMLElement).className;
        const staggerMatch = classes.match(/stagger-(\d+)/);
        const staggerDelay = staggerMatch ? (parseInt(staggerMatch[1]) - 1) * 0.1 : index * 0.1;

        // Create GSAP animation
        gsap.to(child, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: child,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
            markers: false,
          },
          delay: staggerDelay,
        });
      });
    } else {
      // Animate the whole section if no children
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(30px)';

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return ref;
}
