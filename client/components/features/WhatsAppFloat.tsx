'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/919999999999"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.1,
        rotate: 5,
      }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}