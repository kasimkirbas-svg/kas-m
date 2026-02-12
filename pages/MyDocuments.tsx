import React, { useState } from 'react';
import { GeneratedDocument } from '../types';
import { FileText, Calendar, Download, Trash2, Search, Eye } from 'lucide-react';

interface MyDocumentsProps {
  documents: GeneratedDocument[];
  onDeleteDocument: (id: string) => void;
  onPreviewDocument?: (doc: GeneratedDocument) => void;
  t?: any;
}

export const MyDocuments: React.FC<MyDocumentsProps> = ({ 
  documents, 
  onDeleteDocument,
  onPreviewDocument,
  t 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter(doc => 
    doc.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.templateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.additionalNotes && doc.additionalNotes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t?.myDocuments?.title}</h1>
          <p className="text-slate-500">{t?.myDocuments?.subtitle}</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t?.common?.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {filteredDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">{t?.myDocuments?.documentName}</th>
                  <th className="px-6 py-4">{t?.myDocuments?.createdDate}</th>
                  <th className="px-6 py-4">{t?.myDocuments?.company}</th>
                  <th className="px-6 py-4 text-right">{t?.common?.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{doc.templateId} {t?.myDocuments?.documentSuffix}</p>
                          <p className="text-xs text-slate-500">ID: {doc.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        {new Date(doc.createdAt).toLocaleDateString()}
                        <span className="text-xs text-slate-400">{new Date(doc.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {doc.companyName || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                          onClick={() => onPreviewDocument && onPreviewDocument(doc)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title={t?.common?.preview || "Preview"}
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                          title={t?.common?.download}
                          onClick={() => alert(t?.myDocuments?.downloadSimulated)}
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title={t?.common?.delete}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">{t?.myDocuments?.noDocsTitle}</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              {t?.myDocuments?.noDocsDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
