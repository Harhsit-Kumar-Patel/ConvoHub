// client/src/components/Button.jsx
import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}) {
  const baseClasses =
    'px-4 py-2 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary:
      'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    ghost: 'bg-transparent text-text-primary hover:bg-neutral-dark/10',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}