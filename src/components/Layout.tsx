import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <motion.main
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>FocusFlow &copy; {new Date().getFullYear()} - Stay focused, stay productive</p>
      </footer>
    </div>
  );
};

export default Layout;