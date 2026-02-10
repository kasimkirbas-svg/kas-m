// Türkçe (TR)
const tr = {
  common: {
    welcome: 'Hoşgeldiniz',
    logout: 'Çıkış',
    save: 'Kaydet',
    cancel: 'İptal',
    delete: 'Sil',
    edit: 'Düzenle',
    loading: 'Yükleniyor...',
    success: 'Başarılı',
    error: 'Hata',
    confirm: 'Onayla'
  },
  auth: {
    login: 'Giriş Yap',
    signup: 'Kaydol',
    email: 'E-posta',
    password: 'Şifre',
    name: 'Ad Soyad',
    company: 'Şirket Adı',
    confirmPassword: 'Şifre Onayla',
    demoTest: 'Demo ile Dene'
  },
  nav: {
    dashboard: 'Ana Sayfa',
    documents: 'Dokümanlar',
    account: 'Hesabım',
    settings: 'Ayarlar',
    admin: 'Yönetici'
  },
  settings: {
    title: 'Ayarlar',
    notifications: 'Bildirim Ayarları',
    privacy: 'Gizlilik & Güvenlik',
    appearance: 'Görünüm',
    language: 'Dil',
    theme: 'Tema',
    light: 'Açık',
    dark: 'Koyu',
    auto: 'Otomatik'
  },
  dashboard: {
    welcome: 'Hoşgeldin',
    remainingDownloads: 'Kalan İndirme Hakkı',
    createDocument: 'Doküman Oluştur',
    recentActivity: 'Son İşlemler'
  }
};

// İngilizce (EN)
const en = {
  common: {
    welcome: 'Welcome',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    confirm: 'Confirm'
  },
  auth: {
    login: 'Sign In',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    company: 'Company Name',
    confirmPassword: 'Confirm Password',
    demoTest: 'Try Demo'
  },
  nav: {
    dashboard: 'Dashboard',
    documents: 'Documents',
    account: 'My Account',
    settings: 'Settings',
    admin: 'Admin'
  },
  settings: {
    title: 'Settings',
    notifications: 'Notification Settings',
    privacy: 'Privacy & Security',
    appearance: 'Appearance',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto'
  },
  dashboard: {
    welcome: 'Welcome',
    remainingDownloads: 'Remaining Downloads',
    createDocument: 'Create Document',
    recentActivity: 'Recent Activity'
  }
};

// Arapça (AR)
const ar = {
  common: {
    welcome: 'أهلا وسهلا',
    logout: 'تسجيل الخروج',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    loading: 'جاري التحميل...',
    success: 'نجح',
    error: 'خطأ',
    confirm: 'تأكيد'
  },
  auth: {
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم الكامل',
    company: 'اسم الشركة',
    confirmPassword: 'تأكيد كلمة المرور',
    demoTest: 'جرب العرض التوضيحي'
  },
  nav: {
    dashboard: 'لوحة التحكم',
    documents: 'المستندات',
    account: 'حسابي',
    settings: 'الإعدادات',
    admin: 'إدارة'
  },
  settings: {
    title: 'الإعدادات',
    notifications: 'إعدادات الإشعارات',
    privacy: 'الخصوصية والأمان',
    appearance: 'المظهر',
    language: 'اللغة',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    auto: 'تلقائي'
  },
  dashboard: {
    welcome: 'مرحبا',
    remainingDownloads: 'التنزيلات المتبقية',
    createDocument: 'إنشاء مستند',
    recentActivity: 'النشاط الأخير'
  }
};

export const translations = {
  tr,
  en,
  ar
};

export const getTranslation = (language: string) => {
  return translations[language as keyof typeof translations] || translations.tr;
};
