import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const children = el.querySelectorAll('[data-reveal]');
    if (children.length > 0) {
      children.forEach((child) => {
        child.classList.add('opacity-0');
        observer.observe(child);
      });
    } else {
      el.classList.add('opacity-0');
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
