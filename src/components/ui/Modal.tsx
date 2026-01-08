/**
 * Modal component with glass effects and smooth animations
 */

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';
import { liquidTransition } from '../../utils/motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'lg' }: ModalProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95, y: 20 }}
            transition={liquidTransition}
            className={`relative w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col m-4`}
          >
            {/* Glass container */}
            <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-background/80 backdrop-blur-2xl border border-white/30 dark:border-border/50 shadow-2xl shadow-black/20">
              {/* Glass shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between p-4 border-b border-white/20 dark:border-border/50 shrink-0">
                <h2 className="text-xl font-semibold">{title}</h2>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 rounded-xl hover:bg-white/20 dark:hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative flex-1 overflow-y-auto p-4 min-h-0">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="relative border-t border-white/20 dark:border-border/50 p-4 shrink-0 bg-white/30 dark:bg-black/10">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
