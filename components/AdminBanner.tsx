import React from 'react';

interface AdminBannerProps {
  onSignOut: () => void;
}

const AdminBanner: React.FC<AdminBannerProps> = ({ onSignOut }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-green-600 text-white p-3 text-center z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <p className="font-bold text-sm md:text-base">
          <span role="img" aria-label="pencil">✏️</span> Admin Mode Active
        </p>
        <button
          onClick={onSignOut}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs md:text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminBanner;
