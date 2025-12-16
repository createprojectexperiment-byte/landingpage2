import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} DFX Store. All Rights Reserved.</p>
        <p className="text-sm mt-2">
            Pusat Tools-Tools Trading Bermanfaat
        </p>
      </div>
    </footer>
  );
};

export default Footer;
