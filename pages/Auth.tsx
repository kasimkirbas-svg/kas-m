import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Building, ArrowRight, ShieldCheck, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { APP_NAME } from '../constants';
import { UserRole, SubscriptionPlan } from '../types';

type AuthMode = 'login' | 'register' | 'forgot_password';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (mode === 'forgot_password') {
      if (!formData.email) {
        setMessage({ type: 'error', text: 'Lütfen e-posta adresinizi giriniz.' });
        return;
      }
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' });
      }, 500);
      return;
    }

    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        setMessage({ type: 'error', text: 'Lütfen e-posta ve şifrenizi giriniz.' });
        return;
      }
      onAuthSuccess({
        id: Date.now().toString(),
        name: formData.email.split('@')[0] || 'Kullanıcı',
        email: formData.email,
        role: UserRole.SUBSCRIBER,
        plan: SubscriptionPlan.YEARLY,
        remainingDownloads: 100,
        companyName: formData.companyName || 'Bireysel'
      });
    } else {
      if (!formData.email || !formData.password || !formData.name) {
        setMessage({ type: 'error', text: 'Lütfen tüm zorunlu alanları doldurunuz.' });
        return;
      }
      onAuthSuccess({
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: UserRole.GUEST,
        plan: SubscriptionPlan.FREE,
        remainingDownloads: 3,
        companyName: formData.companyName
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 cursor-pointer mb-8" onClick={onBack}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
              <FileText size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
              {APP_NAME}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {mode === 'login' && 'Hesabınıza giriş yapın'}
            {mode === 'register' && 'Yeni hesap oluşturun'}
            {mode === 'forgot_password' && 'Şifrenizi sıfırlayın'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600 mb-8">
            {mode === 'login' && (
              <>Hesabınız yok mu?{' '}
                <button type="button" onClick={() => setMode('register')} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Hemen ücretsiz kayıt olun
                </button>
              </>
            )}
            {mode === 'register' && (
              <>Zaten bir hesabınız var mı?{' '}
                <button type="button" onClick={() => setMode('login')} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Buradan giriş yapın
                </button>
              </>
            )}
            {mode === 'forgot_password' && (
              <>Şifrenizi hatırladınız mı?{' '}
                <button type="button" onClick={() => setMode('login')} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Giriş sayfasına dön
                </button>
              </>
            )}
          </p>

          {message && (
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.type === 'success' ? <CheckCircle size={20} className="text-green-600 mt-0.5" /> : <ShieldCheck size={20} className="text-red-600 mt-0.5" />}
              <p className="font-medium text-sm">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <div className="mt-1 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border outline-none transition-shadow" placeholder="Adınız Soyadınız" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Firma Adı (Opsiyonel)</label>
                  <div className="mt-1 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border outline-none transition-shadow" placeholder="Firma Adı" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">E-posta Adresi</label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border outline-none transition-shadow" placeholder="ornek@sirket.com" />
              </div>
            </div>

            {mode !== 'forgot_password' && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Şifre</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => setMode('forgot_password')} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Şifrenizi mi unuttunuz?
                    </button>
                  )}
                </div>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border outline-none transition-shadow" placeholder="••••••••" />
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" size="lg" className="w-full flex justify-center items-center gap-2">
                {mode === 'login' && 'Giriş Yap'}
                {mode === 'register' && 'Kayıt Ol'}
                {mode === 'forgot_password' && 'Bağlantı Gönder'}
                <ArrowRight size={18} />
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 to-slate-900 opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md text-white text-center">
            <div className="mb-8 flex justify-center">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <ShieldCheck size={48} className="text-blue-300" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Kurumsal Doküman Yönetimi</h2>
            <p className="text-lg text-blue-100 font-medium leading-relaxed">
              İşletmenizin ihtiyaç duyduğu acil durum planları, denetim raporları ve belgeleri güvenle oluşturun, bulutta saklayın.
            </p>
            
            <div className="mt-12 text-left space-y-4 text-blue-100/80">
              <div className="flex items-center gap-3"><CheckCircle size={20} className="text-blue-400"/> Gelişmiş PDF dışa aktarma (Fotoğraflı)</div>
              <div className="flex items-center gap-3"><CheckCircle size={20} className="text-blue-400"/> Bulut tabanlı güvenli depolama</div>
              <div className="flex items-center gap-3"><CheckCircle size={20} className="text-blue-400"/> Yüzlerce profesyonel şablon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
