import React, { useState } from 'react';
import { DocumentTemplate } from '../types';
import { Search, Filter, FileText, Lock } from 'lucide-react';

interface DocumentsListProps {
  templates: DocumentTemplate[];
  onSelectTemplate: (template: DocumentTemplate) => void;
  userIsPremium?: boolean;
  t?: any;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  templates,
  onSelectTemplate,
  userIsPremium = false,
  t
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(templates.map(t => t.category)));

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    const isPremiumAllowed = !template.isPremium || userIsPremium;
    
    return matchesSearch && matchesCategory && isPremiumAllowed;
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{t?.documents?.allTemplates || 'Doküman Şablonları'}</h2>
        <p className="text-indigo-100">
          Toplam {filteredTemplates.length} doküman şablonu ({templates.length} {t?.common?.loading || 'mevcut'})
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t?.documents?.search || 'Doküman ara...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {t?.documents?.filter || 'Tümü'}
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">Aradığınız doküman bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg hover:shadow-lg transition cursor-pointer overflow-hidden group"
                onClick={() => onSelectTemplate(template)}
              >
                {/* Card Header */}
                <div className={`p-4 ${
                  template.isPremium
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <FileText 
                      className={template.isPremium ? 'text-purple-600' : 'text-blue-600'}
                      size={24}
                    />
                    {template.isPremium && (
                      <div className="flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                        <Lock size={12} />
                        PREMIUM
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-indigo-600 font-medium mt-1">
                    {template.category}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {template.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 text-xs text-gray-600">
                    {template.photoCapacity && (
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        Fotoğraf Kapasitesi: {template.photoCapacity}
                      </div>
                    )}
                    {template.monthlyLimit !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {template.monthlyLimit === undefined || template.monthlyLimit === null 
                          ? 'Sınırsız Kullanım'
                          : `Aylık Limit: ${template.monthlyLimit}`
                        }
                      </div>
                    )}
                    {template.fields.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {template.fields.length} Özel Alan
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 group-hover:bg-indigo-50 transition">
                  <button className="w-full text-indigo-600 font-semibold text-sm hover:text-indigo-700 py-1">
                    Doküman Oluştur →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
