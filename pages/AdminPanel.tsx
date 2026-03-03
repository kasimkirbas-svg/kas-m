import React from 'react';
import { User } from '../types';

interface AdminProps {
  user?: User;
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminProps> = ({ user, onLogout }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <p className="text-slate-400 mb-8">Bu panel yeniden yapılandırılıyor...</p>
      {onLogout && (
        <button 
          onClick={onLogout}
          className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Çıkış Yap
        </button>
      )}
    </div>
  );
};
