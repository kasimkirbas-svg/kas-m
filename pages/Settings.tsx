import React from 'react';

interface SettingsProps {
  user?: any;
}

export const Settings: React.FC<SettingsProps> = ({ user }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Ayarlar</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded">
          <span className="text-slate-900">E-posta Bildirimleri</span>
          <input type="checkbox" defaultChecked className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded">
          <span className="text-slate-900">Sistem Bildirimleri</span>
          <input type="checkbox" defaultChecked className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded">
          <span className="text-slate-900">Pazarlama E-postaları</span>
          <input type="checkbox" className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
