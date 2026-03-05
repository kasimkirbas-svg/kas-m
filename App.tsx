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
import { Check, Lock, Shield, Star, Users, FileText, DollarSign, TrendingUp, Search, MoreHorizontal, ArrowLeft, MessageCircle } from 'lucide-react';
import { getTranslation } from './i18n';

const App = () => {
  // Get initial view from URL
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewOpt = params.get('view');
      if (viewOpt) return viewOpt;
    }
    return 'auth';
  };

  // State
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState(getInitialView);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templates, setTemplates] = useState<DocumentTemplate[]>(MOCK_TEMPLATES);
  const [isLoading, setIsLoading] = useState(true);
  // Theme is strictly dark now
  const [theme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState<'tr' | 'en' | 'ar'>('tr');
  const [t, setT] = useState(getTranslation('tr'));
  const [savedDocuments, setSavedDocuments] = useState<GeneratedDocument[]>([]);
  const [editingDocument, setEditingDocument] = useState<GeneratedDocument | undefined>(undefined);
  // NEW: State for Read-Only Preview Mode
  const [previewDocument, setPreviewDocument] = useState<GeneratedDocument | undefined>(undefined);
  // NEW: Navigation Params
  const [navParams, setNavParams] = useState<{ category?: string, search?: string }>({});

  const handleEditDocument = (doc: GeneratedDocument) => {
    const template = templates.find(t => t.id === doc.templateId);
    if (template) {
      setSelectedTemplate(template);
      setEditingDocument(doc);
      setPreviewDocument(undefined); // Ensure preview is off
      navigateWithHistory('editor');
    } else {
      alert('Bu dokümana ait şablon bulunamadı. (ID: ' + doc.templateId + ')');
    }
  };

  const handleNavigate = (view: string, params?: { category?: string, search?: string }) => {
    setNavParams(params || {});
    navigateWithHistory(view);
  };

  const navigateWithHistory = (view: string, replace = false) => {
    setCurrentView((prevView) => {
        if (prevView !== view) {
            if (replace) {
                window.history.replaceState({ view }, '', `?view=${view}`);
            } else {
                window.history.pushState({ view }, '', `?view=${view}`);
            }
        }
        return view;
    });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navigateWithHistory('dashboard', true);
    }
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Initialize without overwriting if there's already state
    if (!window.history.state || !window.history.state.view) {
        window.history.replaceState({ view: currentView }, '', `?view=${currentView}`);
    }
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  const handlePreviewDocument = (doc: GeneratedDocument) => {
    const template = templates.find(t => t.id === doc.templateId);
    if (template) {
       setSelectedTemplate(template);
       setPreviewDocument(doc); // Turn on preview mode
       setEditingDocument(doc); // Still need data to populate fields
       navigateWithHistory('editor');
    } else {
       alert('Bu dokümana ait şablon bulunamadı. (ID: ' + doc.templateId + ')');
    }
  };

  // 1. Theme Effect: Sync theme state to DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 2. Main Initialization Effect
  useEffect(() => {
    // A. User Loading
    const existingUsers = localStorage.getItem('allUsers');
    if (!existingUsers) {
      const initialUsers: User[] = [ADMIN_USER];
      localStorage.setItem('allUsers', JSON.stringify(initialUsers));
    }

    const savedUserStr = localStorage.getItem('currentUser');
    if (savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        setUser(parsedUser);
        if (currentView === 'auth') navigateWithHistory('dashboard', true);
        
        // Validate user session
        fetchApi('/api/auth/me')
          .then(res => {
            if (!res.ok) throw new Error('User invalid');
            return res.json();
          })
          .then(data => {
            if (!data.success) throw new Error('Session invalid');
             // setUser(data.user); // Optional sync
          })
          .catch(() => {
            console.warn('Session expired. Logging out.');
            setUser(null);
            navigateWithHistory('auth', true);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
          });
      } catch (e) {
        console.error('Error parsing user', e);
        setUser(null);
        localStorage.removeItem('currentUser');
      }
    }

    // B. Settings Loading
    // Theme is forced to dark, ignoring saved preference

    const savedLanguage = localStorage.getItem('language') as 'tr' | 'en' | 'ar' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setT(getTranslation(savedLanguage));
      const dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = savedLanguage;
    }

    // C. Data Loading (Templates)
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
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();

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
             navigateWithHistory('auth', true);
         }
      }
      if (e.key === 'authToken' && !e.newValue) {
          setUser(null);
          navigateWithHistory('auth', true);
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
      navigateWithHistory('admin', true);
    } else {
      navigateWithHistory('dashboard', true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigateWithHistory('auth', true);
    setSelectedTemplate(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken'); // Clear auth token
  };

  const handleUpgrade = async (selectedPlan: SubscriptionPlan) => {
    if (!user) return;

    try {
        const response = await fetchApi('/api/users/upgrade', {
            method: 'POST',
            body: JSON.stringify({ userId: user.id, plan: selectedPlan })
        });

        if (!response.ok) {
            throw new Error('Sunucu hatası: ' + response.statusText);
        }

        const data = await response.json();
        if (!data.success || !data.user) {
             throw new Error(data.message || 'Güncelleme başarısız oldu.');
        }

        const updatedUser = data.user;

        // Update State
        setUser(updatedUser);
        
        // Update LocalStorage (CurrentUser)
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Update LocalStorage (AllUsers - Legacy/Offline backup)
        // Note: In real mode, we rely on backend, but keeping local sync for offline fallback is acceptable if desired.
        // However, user asked for "NO SIMULATION". Relying on local storage user array is a form of simulation/mock db.
        // I will keep it for session persistence but the main source is now the backend response.

        alert(t?.subscription?.successMessage || 'Aboneliğiniz başarıyla başlatıldı.');
        navigateWithHistory('profile');

    } catch (apiError: any) {
        console.error('Upgrade API error:', apiError); 
        alert('İşlem başarısız: ' + apiError.message);
        // Important: Do NOT update local state if backend failed.
        throw apiError; // Re-throw so SubscriptionPage knows it failed
    }
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
      return <AdminPanel user={user} onLogout={handleLogout} />
    }

    // 1. Document Editor
    if (user && currentView === 'editor' && selectedTemplate) {
      return (
        <div className="space-y-4">
          <DocumentEditor 
            template={selectedTemplate}
            initialData={editingDocument}
            isReadOnly={!!previewDocument} // Pass read-only flag if we are previewing
            userId={user.id}
            userEmail={user.email}
            companyName={user.companyName}
            preparedBy={user.name}
            onClose={() => {
              if (editingDocument || previewDocument) {
                  navigateWithHistory('my-documents');
              } else {
                  navigateWithHistory('templates');
              }
              setEditingDocument(undefined);
              setPreviewDocument(undefined); 
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
              navigateWithHistory('my-documents');
            }}
            t={t}
          />
        </div>
      );
    }

    // 2. My Documents List
    if (user && currentView === 'my-documents') {
        return (
            <Layout 
              user={user} 
              currentView={currentView} 
              onNavigate={handleNavigate} 
              onGoBack={handleGoBack}
              canGoBack={window.history.length > 1 && currentView !== 'dashboard'}
              onLogout={handleLogout}
              language={language}
              onLanguageChange={handleLanguageChange}
              theme={theme}
              documentsCount={savedDocuments.length}
              t={t}
            >
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
            </Layout>
        );
    }

    // 3. Template List (Documents)
    if (user && currentView === 'templates') {
      return (
        <Layout 
          user={user} 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          onGoBack={handleGoBack}
          canGoBack={window.history.length > 1 && currentView !== 'dashboard'}
          onLogout={handleLogout}
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          documentsCount={savedDocuments.length}
          t={t}
        >
          <div>

          <DocumentsList
              templates={templates}
              initialCategory={navParams.category}
              initialSearchQuery={navParams.search}
              userIsPremium={user.plan === 'YEARLY'}
              onSelectTemplate={(template) => {
                setSelectedTemplate(template);
                navigateWithHistory('editor');
              }}
              t={t}
            />
          </div>
        </Layout>
      );
    }

    // 4. Dashboard (Home)
    if (user && currentView === 'dashboard') {
      return (
        <Layout onGoBack={handleGoBack} 
          user={user} 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          documentsCount={savedDocuments.length}
          t={t}
        >
          <Dashboard
            user={user}
            t={t}
            onNavigate={handleNavigate}
            onTemplateSelect={(tag) => {
              if (tag) {
                  // If tag is a string (category), navigate to templates with category
                  if (typeof tag === 'string') {
                      handleNavigate('templates', { category: tag });
                  } else {
                      // If it's a template object
                      setSelectedTemplate(tag as any);
                      navigateWithHistory('editor');
                  }
              }
            }}
            onPurchase={(plan) => handleUpgrade(plan as any)}
            templates={templates}
            recentDocuments={savedDocuments}
            savedDocuments={savedDocuments}
          />
        </Layout>
      );
    }

    // 5. Profile Page
    if (user && currentView === 'profile') {
      return (
        <Layout onGoBack={handleGoBack} 
          canGoBack={window.history.length > 1 && currentView !== 'dashboard'}
          user={user} 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          documentsCount={savedDocuments.length}
          t={t}
        >

          <Profile user={user} t={t} onNavigate={handleNavigate} />
        </Layout>
      );
    }

    // 6. Settings Page
    if (user && currentView === 'settings') {
      return (
        <Layout onGoBack={handleGoBack} 
          canGoBack={window.history.length > 1 && currentView !== 'dashboard'}
          user={user} 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          documentsCount={savedDocuments.length}
          t={t}
        >

          <Settings 
            user={user}
            theme={theme}
            language={language}
            t={t}
            onLanguageChange={handleLanguageChange}
          />
        </Layout>
      );
    }

    // 7. Subscription Page
    if (user && currentView === 'subscription') {
      return (
         <Layout onGoBack={handleGoBack} 
            canGoBack={window.history.length > 1 && currentView !== 'dashboard'}
            user={user} 
            currentView={currentView} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout}
            language={language}
            onLanguageChange={handleLanguageChange}
            theme={theme}
            documentsCount={savedDocuments.length}
            t={t}
          >
           <SubscriptionPage 
              user={user}
              t={t}
              onUpgrade={handleUpgrade}
              onBack={handleGoBack}
           />
         </Layout>
      );
    }
    
    // 7. Admin Panel (Handles all admin-related views)
    if (user?.role === UserRole.ADMIN && ['admin', 'subscribers', 'users', 'admin-templates', 'admin-packages'].includes(currentView)) {
      return <AdminPanel user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
    }

    // Default Fallback
    return (
      <Layout onGoBack={handleGoBack} 
        canGoBack={window.history.length > 1 && currentView !== 'dashboard'}
        user={user} 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        // Theme is locked
        documentsCount={savedDocuments.length}
        t={t}
      >
        <div className="p-8 text-center text-slate-500">Sayfa yükleniyor... ({currentView})</div>
      </Layout>
    );
  };

  return (
    <>
      {renderContent()}

      {/* Floating Buttons: General */}
      {user && currentView !== 'editor' && (
        <>
          {/* 24/7 Live Support Floating Button (Bottom Right) */}
          <button 
            onClick={() => alert('7/24 Canlı destek hattımız yapım aşamasındadır. En kısa sürede aktif olacaktır!')} // Can integrate Intercom, Tawk.to etc.
            className="fixed bottom-6 right-6 z-[100] group flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-5 rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 hover:-translate-y-1 transition-all"
          >
            <MessageCircle size={22} className="animate-pulse" />
            <span className="hidden md:block">7/24 Canlı Destek</span>
            {/* Ping dot */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-slate-900"></span>
            </span>
          </button>
        </>
      )}
    </>
  );
};

export default App;
