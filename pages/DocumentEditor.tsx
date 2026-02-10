import React, { useState } from 'react';
import { DocumentTemplate, GeneratedDocument, DocumentPhoto } from '../types';
import { Upload, Trash2, Plus, Download, FileText } from 'lucide-react';
import { Button } from '../components/Button';

interface DocumentEditorProps {
  template: DocumentTemplate;
  onClose?: () => void;
  onDocumentGenerated?: (document: GeneratedDocument) => void;
  userId?: string;
  companyName?: string;
  preparedBy?: string;
  t?: any;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  template,
  onClose,
  onDocumentGenerated,
  userId = '1',
  companyName = '',
  preparedBy = '',
  t
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    companyName: companyName || '',
    preparedBy: preparedBy || '',
    date: new Date().toISOString().split('T')[0],
  });

  const [photos, setPhotos] = useState<DocumentPhoto[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const maxPhotos = template.photoCapacity || 15;

  // Form input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (photos.length >= maxPhotos) {
        alert(t?.editor?.maxPhotoError?.replace('{count}', maxPhotos) || `Maksimum ${maxPhotos} fotoğraf ekleyebilirsiniz!`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random().toString(),
          base64,
          uploadedAt: new Date().toISOString()
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove photo
  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  // Generate document (simulate PDF creation)
  const handleGenerateDocument = () => {
    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const document: GeneratedDocument = {
        id: 'doc-' + Date.now(),
        userId,
        templateId: template.id,
        data: formData,
        photos: photos,
        createdAt: new Date().toISOString(),
        generatedAt: new Date().toISOString(),
        status: 'COMPLETED',
        companyName: formData.companyName,
        preparedBy: formData.preparedBy,
        additionalNotes
      };

      onDocumentGenerated?.(document);
      setIsGenerating(false);

      // Simulate PDF download
      const pdfContent = `
        ======================================
        ${template.title}
        ======================================
        
        ${t?.editor?.pdfCompany || 'Firma'}: ${formData.companyName}
        ${t?.editor?.pdfPreparedBy || 'Hazırlayan'}: ${formData.preparedBy}
        ${t?.editor?.pdfDate || 'Tarih'}: ${formData.date}
        ${t?.editor?.pdfPhotos || 'Fotoğraf Sayısı'}: ${photos.length}
        ${t?.editor?.pdfNotes || 'Ek Notlar'}: ${additionalNotes || (t?.editor?.pdfNone || 'Yok')}
        
        ======================================
        Bu belge ${new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.
      `;

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pdfContent));
      element.setAttribute('download', `${template.title}-${formData.date}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      alert(t?.editor?.photoSuccess || 'Doküman başarıyla oluşturuldu ve indirilmeye hazırdır!');
    }, 1000);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">{template.title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-500 rounded-full p-2 transition"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-blue-100">{template.description}</p>
        <p className="text-blue-100 text-sm mt-2">
          {t?.documents?.photoCapacity || 'Fotoğraf Kapasitesi'}: {photos.length}/{maxPhotos}
        </p>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Form Fields */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t?.editor?.documentInfo || 'Belge Bilgileri Gir'}</h3>

          {/* Standard Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t?.editor?.firmName || 'Firma Adı'} *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Firma adı giriniz"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t?.editor?.preparedBy || 'Hazırlayan Kişi'} *
              </label>
              <input
                type="text"
                name="preparedBy"
                value={formData.preparedBy}
                onChange={handleInputChange}
                placeholder="Adı Soyadı"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t?.editor?.date || 'Tarih'} *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Template Specific Fields */}
          {template.fields.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">{t?.editor?.templateFields || 'Şablon Alanları'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {template.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && '*'}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Photo Upload Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload size={20} />
            {t?.editor?.uploadPhotos || 'Fotoğraf Ekle'} ({photos.length}/{maxPhotos})
          </h3>

          <div className="mb-4">
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <div className="text-center">
                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-gray-600 font-medium">{t?.editor?.selectPhotos || 'Fotoğraf seçin'}</p>
                <p className="text-gray-500 text-sm">{t?.editor?.photoInfo || 'PNG, JPG, GIF (Max 10 MB)'}</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={photos.length >= maxPhotos}
                className="hidden"
              />
            </label>
          </div>

          {/* Photo Gallery */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, idx) => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={photo.base64}
                    alt={`Fotoğraf ${idx + 1}`}
                    className="w-full h-32 object-cover cursor-pointer hover:opacity-75"
                    onClick={() => setPhotoPreview(photo.base64)}
                  />
                  <button
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Notes Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={20} />
            {t?.editor?.additionalItems || 'Ek Maddeler'}
          </h3>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder={t?.editor?.additionalItemsPlaceholder || 'Dokümanın içerisine eklemek istediğiniz ek bilgi veya maddeleri yazınız...'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
          />
        </div>

        {/* Photo Preview Modal */}
        {photoPreview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setPhotoPreview(null)}
          >
            <div className="bg-white rounded-lg max-w-2xl w-full p-4">
              <img src={photoPreview} alt="Preview" className="w-full h-auto rounded" />
              <button
                onClick={() => setPhotoPreview(null)}
                className="mt-4 w-full bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400"
              >
                {t?.editor?.close || 'Kapat'}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              {t?.common?.cancel || 'İptal'}
            </button>
          )}
          <button
            onClick={handleGenerateDocument}
            disabled={!formData.companyName || !formData.preparedBy || isGenerating}
            className={`px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition ${
              isGenerating || !formData.companyName || !formData.preparedBy
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin">⏳</span>
                {t?.editor?.preparing || 'Hazırlanıyor...'}
              </>
            ) : (
              <>
                <Download size={18} />
                {t?.editor?.prepareDownload || 'Hazırla ve İndir'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
