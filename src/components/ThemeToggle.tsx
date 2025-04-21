import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const ThemeToggle: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { darkMode } = state;

  return (
    <motion.button
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors dark:focus:ring-primary-400"
      onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
      whileTap={{ scale: 0.9 }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-yellow-400" />
      ) : (
        <Moon className="h-5 w-5 text-primary-600" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;