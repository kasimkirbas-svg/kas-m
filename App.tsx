import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DocumentEditor } from './pages/DocumentEditor';
import { DocumentsList } from './pages/DocumentsList';
import { AdminPanel } from './pages/AdminPanel';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Dashboard } from './pages/Dashboard';
import { MyDocuments } from './pages/MyDocuments'; // Add this import
import { SubscriptionPage } from './pages/SubscriptionPage';
import { Button } from './components/Button';
import { APP_NAME, PLANS, MOCK_TEMPLATES, ADMIN_USER } from './constants';
import { User, UserRole, SubscriptionPlan, DocumentTemplate, GeneratedDocument } from './types';
import { fetchApi } from './src/utils/api';
import { Check, Lock, Shield, Star, Users, FileText, DollarSign, TrendingUp, Search, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { getTranslation } from './i18n';

const App = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('auth');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templates, setTemplates] = useState<DocumentTemplate[]>(MOCK_TEMPLATES);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'tr' | 'en' | 'ar'>('tr');
  const [t, setT] = useState(getTranslation('tr'));
  const [savedDocuments, setSavedDocuments] = useState<GeneratedDocument[]>([]);
  const [editingDocument, setEditingDocument] = useState<GeneratedDocument | undefined>(undefined);
  // NEW: State for Read-Only Preview Mode
  const [previewDocument, setPreviewDocument] = useState<GeneratedDocument | undefined>(undefined);

  const handleEditDocument = (doc: GeneratedDocument) => {
    const template = MOCK_TEMPLATES.find(t => t.id === doc.templateId);
    if (template) {
      setSelectedTemplate(template);
      setEditingDocument(doc);
      setPreviewDocument(undefined); // Ensure preview is off
      setCurrentView('editor');
    } else {
      alert('Bu dokümana ait şablon bulunamadı.');
    }
  };

  const handlePreviewDocument = (doc: GeneratedDocument) => {
    const template = MOCK_TEMPLATES.find(t => t.id === doc.templateId);
    if (template) {
       setSelectedTemplate(template);
       setPreviewDocument(doc); // Turn on preview mode
       setEditingDocument(doc); // Still need data to populate fields
       setCurrentView('editor');
    } else {
       alert('Bu dokümana ait şablon bulunamadı.');
    }
  };

  // Initialize application on mount (load users, theme, language, documents)
  useEffect(() => {
    // Initialize admin user if no users exist
    const existingUsers = localStorage.getItem('allUsers');
    if (!existingUsers) {
      const initialUsers: User[] = [ADMIN_USER];
      localStorage.setItem('allUsers', JSON.stringify(initialUsers));
    }

    const savedUser = localStorage.getItem('currentUser');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const savedLanguage = localStorage.getItem('language') as 'tr' | 'en' | 'ar' | null;
    // Documents are loaded from API when user is logged in
    // const loadedDocs = localStorage.getItem('generatedDocuments');

    /* if (loadedDocs) {
      try {
        setSavedDocuments(JSON.parse(loadedDocs));
      } catch (e) {
        console.error('Error loading documents', e);
      }
    } */

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setCurrentView('dashboard');
        
        // Security Check: Verify user still exists (invalidates deleted users on refresh)
        fetchApi('/api/auth/me')
            .then(res => {
                if (!res.ok) {
                    throw new Error('User invalid');
                }
                return res.json();
            })
            .then(data => {
                if(!data.success) {
                     throw new Error('Session invalid');
                }
                // Optional: Update user data
                // setUser(data.user);
            })
            .catch(() => {
                // If API returns 401/403 or user not found
                console.warn('Session expired or user deleted. Logging out.');
                setUser(null);
                setCurrentView('auth');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('authToken');
            });

      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
        localStorage.removeItem('currentUser');
      }
    }

    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Fetch Templates from Backend
    const loadTemplates = async () => {
        try {
            const res = await fetchApi('/api/templates');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setTemplates(data);
                }
            }
        } catch (e) {
            console.error('Failed to load templates', e);
        }
    };
    loadTemplates();

    if (savedLanguage) {
      setLanguage(savedLanguage);
      setT(getTranslation(savedLanguage));
      // Update info for RTL
      const dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = savedLanguage;
    }

    // Apply theme
    applyTheme(savedTheme || 'light');

    setIsLoading(false);
  }, []);

  // Fetch Documents
  useEffect(() => {
    const fetchDocs = async () => {
        if (!user) {
            setSavedDocuments([]);
            return;
        }
        try {
            const res = await fetchApi('/api/documents');
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.documents)) {
                    setSavedDocuments(data.documents);
                } else {
                    // Fallback if data structure is different or no documents yet
                    setSavedDocuments([]);
                }
            }
        } catch (e) {
            console.error('Failed to load documents', e);
        }
    };
    fetchDocs();
  }, [user]);

  // Update direction when language changes
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  // Cross-tab Synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
         if (e.newValue) {
             const newUser = JSON.parse(e.newValue);
             setUser(newUser);
         } else {
             setUser(null);
             setCurrentView('auth');
         }
      }
      if (e.key === 'authToken' && !e.newValue) {
          setUser(null);
          setCurrentView('auth');
      }
      if (e.key === 'theme' && e.newValue) {
          const newTheme = e.newValue as 'light' | 'dark';
          setTheme(newTheme);
          // applyTheme handles DOM update, but we need to define it first or move this effect. 
          // Since applyTheme is defined below, we can just duplicate logic or rely on the function being available (closure).
          const html = document.documentElement;
          if (newTheme === 'dark') {
            html.classList.add('dark');
          } else {
            html.classList.remove('dark');
          }
      }
      if (e.key === 'language' && e.newValue) {
          const lang = e.newValue as 'tr' | 'en' | 'ar';
          setLanguage(lang);
          setT(getTranslation(lang));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const applyTheme = (themeType: 'light' | 'dark') => {
    const html = document.documentElement;
    if (themeType === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: 'tr' | 'en' | 'ar') => {
    setLanguage(newLanguage);
    setT(getTranslation(newLanguage));
    localStorage.setItem('language', newLanguage);
  };

  // Auth Handlers
  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Belirle admin mi user mi
    if (userData.role === UserRole.ADMIN) {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('auth');
    setSelectedTemplate(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken'); // Clear auth token
  };

  const handleUpgrade = (selectedPlan: SubscriptionPlan) => {
    if (!user) return;

    // Determined limits based on plan
    let newLimit: number | 'UNLIMITED' = 5; // Default free
    if (selectedPlan === SubscriptionPlan.MONTHLY) newLimit = 30;
    if (selectedPlan === SubscriptionPlan.YEARLY) newLimit = 'UNLIMITED';

    const updatedUser: User = {
      ...user,
      plan: selectedPlan,
      remainingDownloads: newLimit,
      subscriptionStartDate: new Date().toISOString(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Mock 30 days
      isActive: true
    };

    // Update State
    setUser(updatedUser);
    
    // Update LocalStorage (CurrentUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update LocalStorage (AllUsers)
    const allUsersStr = localStorage.getItem('allUsers');
    if (allUsersStr) {
      const allUsers: User[] = JSON.parse(allUsersStr);
      const newAllUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('allUsers', JSON.stringify(newAllUsers));
    }

    // Update Legacy Users (if exists)
    const legacyUsersStr = localStorage.getItem('users');
    if (legacyUsersStr) {
      const legacyUsers: User[] = JSON.parse(legacyUsersStr);
      const newLegacyUsers = legacyUsers.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(newLegacyUsers));
    }

    alert(t?.subscription?.successMessage || 'Aboneliğiniz başarıyla başlatıldı.');
    setCurrentView('profile');
  };

  // Navigation Logic
  const renderContent = () => {
    // Loading
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Yükleniyor...</p>
          </div>
        </div>
      );
    }

    // Auth Page
    if (!user) {
      return <Auth onLoginSuccess={handleLogin} t={t} language={language} />
    }

    // ADMIN ROUTING (Prioritize Admin Views)
    if (user?.role === UserRole.ADMIN && ['admin', 'dashboard', 'users', 'templates'].includes(currentView)) {
      return <AdminPanel user={user} t={t} currentView={currentView} />
    }

    // 1. Document Editor
    if (user && currentView === 'editor' && selectedTemplate) {
      return (
        <div className="space-y-4">
          <button 
            onClick={() => {
              setCurrentView('templates');
              setEditingDocument(undefined);
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft size={18} />
            {t?.editor?.back || 'Şablonlara Dön'}
          </button>
          <DocumentEditor 
            template={selectedTemplate}
            initialData={editingDocument}
            isReadOnly={!!previewDocument} // Pass read-only flag if we are previewing
            userId={user.id}
            userEmail={user.email}
            companyName={user.companyName}
            preparedBy={user.name}
            onClose={() => {
              setCurrentView('templates');
              setEditingDocument(undefined);
              setPreviewDocument(undefined); // Reset preview
            }}
            onDocumentGenerated={async (doc: GeneratedDocument) => {
              // Optimistic UI update
              let newDocs;
              if (editingDocument) {
                 newDocs = savedDocuments.map(d => d.id === editingDocument.id ? doc : d);
              } else {
                 newDocs = [doc, ...savedDocuments];
              }
              
              setSavedDocuments(newDocs);
              // Save to API
              try {
                  await fetchApi('/api/documents', {
                      method: 'POST',
                      body: JSON.stringify(doc)
                  });
              } catch (e) {
                  console.error('Failed to save document to API', e);
                  // Optionally revert state?
                  alert('Doküman sunucuya kaydedilemedi ancak yerel önbellekte görüntülenebilir.');
              }
              
              localStorage.setItem('generatedDocuments', JSON.stringify(newDocs)); // Keep backup
              setEditingDocument(undefined);
              
              alert(`✓ ${selectedTemplate.title} ${t?.editor?.photoSuccess || 'dokümanı başarıyla oluşturuldu ve kaydedildi.'}`);
              setCurrentView('my-documents');
            }}
            t={t}
          />
        </div>
      );
    }

    // 2. My Documents List
    if (user && currentView === 'my-documents') {
        return (
            <MyDocuments 
                templates={templates}
                onEditDocument={handleEditDocument}
                onPreviewDocument={handlePreviewDocument} 
                documents={savedDocuments.filter(d => d.userId === user.id)}
                onDeleteDocument={async (id) => {
                    if (window.confirm(t?.common?.confirmDelete || 'Bu dokümanı silmek istediğinize emin misiniz?')) {
                        // Optimistic Delete
                        const newDocs = savedDocuments.filter(d => d.id !== id);
                        setSavedDocuments(newDocs);
                        
                        try {
                             await fetchApi(`/api/documents/${id}`, { method: 'DELETE' });
                             localStorage.setItem('generatedDocuments', JSON.stringify(newDocs)); // Sync backup
                        } catch (e) {
                             console.error('Failed to delete document', e);
                             alert('Doküman sunucudan silinemedi.');
                             // Optionally revert?
                        }
                    }
                }}
                t={t}
            />
        );
    }

    // 3. Template List (Documents)
    if (user && currentView === 'templates') {
      return (
        <div>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft size={18} />
            {t?.common?.back || 'Ana Sayfaya Dön'}
          </button>
          <DocumentsList 
            templates={templates}
            userIsPremium={user.plan === SubscriptionPlan.YEARLY}
            onSelectTemplate={(template) => {
              setSelectedTemplate(template);
              setCurrentView('editor');
            }}
            t={t}
          />
        </div>
      );
    }

    // 3. Dashboard (Home)
    if (user && currentView === 'dashboard') {
      return (
        <Dashboard
          user={user}
          t={t}
          onNavigate={setCurrentView}
          onTemplateSelect={(tpl) => {
            setSelectedTemplate(tpl);
            setCurrentView('editor');
          }}
          templates={templates}
        />
      );
    }

    // 4. Profile Page
    if (user && currentView === 'profile') {
      return <Profile user={user} t={t} onNavigate={setCurrentView} />
    }

    // 5. Settings Page
    if (user && currentView === 'settings') {
      return (
        <Settings 
          user={user}
          theme={theme}
          language={language}
          t={t}
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
        />
      );
    }

    // 6. Subscription Page
    if (user && currentView === 'subscription') {
      return (
         <SubscriptionPage 
            user={user}
            t={t}
            onUpgrade={handleUpgrade}
            onBack={() => setCurrentView('profile')}
         />
      );
    }
    
    // 7. Admin Panel (Handles all admin-related views)
    if (user?.role === UserRole.ADMIN && ['admin', 'subscribers', 'users', 'admin-templates', 'admin-packages'].includes(currentView)) {
      return <AdminPanel user={user} t={t} currentView={currentView} />
    }

    // Default Fallback
    return <div className="p-8 text-center text-slate-500">Sayfa yükleniyor... ({currentView})</div>;
  };

  return (
    <Layout 
      user={user} 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={handleLogout}
      language={language}
      onLanguageChange={handleLanguageChange}
      theme={theme}
      onThemeChange={handleThemeChange}
      t={t}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;