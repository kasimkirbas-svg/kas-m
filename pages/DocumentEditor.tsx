import React from 'react';

interface DocumentEditorProps {
  user?: any;
  template?: any;
  onClose?: () => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ user, template, onClose }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Doküman Editörü</h2>
      <p className="text-slate-600">
        {template ? `Şablon: ${template}` : 'Yeni doküman oluşturuluyor...'}
      </p>
      {onClose && (
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-slate-200 text-slate-900 rounded hover:bg-slate-300"
        >
          Kapat
        </button>
      )}
    </div>
  );
};
