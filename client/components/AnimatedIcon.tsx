import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type AnimationType = 'bounce' | 'spin' | 'pulse' | 'float' | 'swing' | 'wiggle' | 'scale' | 'none';

interface AnimatedIconProps {
  children: ReactNode;
  animation?: AnimationType;
  hoverAnimation?: AnimationType;
  className?: string;
  size?: string;
}

const animationVariants: Record<AnimationType, { animate: any; transition: any }> = {
  bounce: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
  },
  spin: {
    animate: { rotate: 360 },
    transition: { duration: 2, repeat: Infinity, ease: 'linear' },
  },
  pulse: {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  float: {
    animate: { y: [0, -6, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  swing: {
    animate: { rotate: [0, 15, -15, 0] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  wiggle: {
    animate: { x: [0, -4, 4, -4, 4, 0] },
    transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
  },
  scale: {
    animate: { scale: [1, 1.15, 1] },
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
  },
  none: {
    animate: {},
    transition: {},
  },
};

const hoverAnimationVariants: Record<AnimationType, any> = {
  bounce: { y: -8 },
  spin: { rotate: 360 },
  pulse: { scale: 1.2 },
  float: { y: -6 },
  swing: { rotate: 15 },
  wiggle: { x: -4 },
  scale: { scale: 1.2 },
  none: {},
};

export default function AnimatedIcon({
  children,
  animation = 'float',
  hoverAnimation = 'scale',
  className = '',
  size = 'size-5',
}: AnimatedIconProps) {
  const hasAnimation = animation !== 'none';
  const hasHover = hoverAnimation !== 'none';

  return (
    <motion.div
      className={className}
      animate={hasAnimation ? animationVariants[animation].animate : {}}
      transition={hasAnimation ? animationVariants[animation].transition : {}}
      whileHover={hasHover ? hoverAnimationVariants[hoverAnimation] : {}}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
}
