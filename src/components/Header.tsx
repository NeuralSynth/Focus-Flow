import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-2" 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">FocusFlow</h1>
        </motion.div>
        
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;