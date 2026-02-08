import React from 'react';

interface ProfileProps {
  user?: any;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Profil</h2>
      {user && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Ad Soyad</label>
            <p className="text-slate-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">E-posta</label>
            <p className="text-slate-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Şirket</label>
            <p className="text-slate-900">{user.companyName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Paket</label>
            <p className="text-slate-900">{user.plan}</p>
          </div>
        </div>
      )}
    </div>
  );
};
