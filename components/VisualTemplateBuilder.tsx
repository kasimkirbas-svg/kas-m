import React, { useState, useRef, useEffect } from 'react';
import { DocumentTemplate, DocumentField } from '../types';
import { Upload, Plus, Trash2, Move, Type, Calendar, AlignLeft, Hash, CheckSquare, List, GripHorizontal, Maximize2, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';

interface VisualTemplateBuilderProps {
  template: DocumentTemplate;
  onUpdate: (template: DocumentTemplate) => void;
}

export const VisualTemplateBuilder: React.FC<VisualTemplateBuilderProps> = ({ template, onUpdate }) => {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        onUpdate({
          ...template,
          backgroundImage: event.target?.result as string,
          layout: { width: img.width, height: img.height }
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addField = (x: number, y: number) => {
    const newField: DocumentField = {
      key: `field_${Date.now()}`,
      label: 'Yeni Alan',
      type: 'text',
      position: { x, y, width: 200, height: 40 }
    };
    onUpdate({
      ...template,
      fields: [...template.fields, newField]
    });
    setSelectedFieldId(newField.key);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (selectedFieldId || !template.backgroundImage || !containerRef.current) return;
    
    // Yalnızca boş alana tıklandığında alan ekle
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    addField(x, y);
  };

  const updateFieldPosition = (key: string, x: number, y: number) => {
    const fields = template.fields.map(f => {
      if (f.key === key && f.position) {
        return {
          ...f,
          position: { ...f.position, x, y }
        };
      }
      return f;
    });
    onUpdate({ ...template, fields });
  };
  
  const updateFieldSize = (key: string, width: number, height: number) => {
      const fields = template.fields.map(f => {
        if (f.key === key && f.position) {
          return {
            ...f,
            position: { ...f.position, width, height }
          };
        }
        return f;
      });
      onUpdate({ ...template, fields });
    };

  const updateField = (key: string, changes: Partial<DocumentField>) => {
    const fields = template.fields.map(f => f.key === key ? { ...f, ...changes } : f);
    onUpdate({ ...template, fields });
  };

  const deleteField = (key: string) => {
    const fields = template.fields.filter(f => f.key !== key);
    onUpdate({ ...template, fields });
    setSelectedFieldId(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                <ImageIcon size={16} className="text-blue-500" />
                Görsel Editör
            </h3>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-2"></div>
            <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-xs font-medium cursor-pointer hover:bg-blue-100 transition">
                <Upload size={14} />
                {template.backgroundImage ? 'Görseli Değiştir' : 'Arkaplan Yükle (Resim/PDF)'}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
        </div>
        <div className="flex items-center gap-2">
             <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"><ZoomOut size={16} /></button>
             <span className="text-xs text-slate-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
             <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"><ZoomIn size={16} /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Properties Sidebar (Left) */}
        {selectedFieldId && (
            <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 overflow-y-auto z-10 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Alan Özellikleri</h4>
                    <button onClick={() => setSelectedFieldId(null)} className="text-slate-400 hover:text-slate-600"><Maximize2 size={14} /></button>
                </div>
                
                {template.fields.filter(f => f.key === selectedFieldId).map(field => (
                    <div key={field.key} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Etiket</label>
                            <input 
                                type="text" 
                                value={field.label} 
                                onChange={e => updateField(field.key, { label: e.target.value })}
                                className="w-full px-2 py-1.5 text-sm border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Tür</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'text', icon: Type, label: 'Metin' },
                                    { id: 'textarea', icon: AlignLeft, label: 'Paragraf' },
                                    { id: 'date', icon: Calendar, label: 'Tarih' },
                                    { id: 'number', icon: Hash, label: 'Sayı' },
                                    { id: 'checkbox', icon: CheckSquare, label: 'Onay' },
                                ].map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => updateField(field.key, { type: type.id as any })}
                                        className={`flex flex-col items-center justify-center p-2 rounded border text-xs ${field.type === type.id ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <type.icon size={16} className="mb-1" />
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                         <div className="pt-4 border-t border-slate-100">
                             <label className="block text-xs font-bold text-slate-500 mb-1">Değişken Adı (Key)</label>
                             <input 
                                 type="text" 
                                 value={field.key} 
                                 readOnly
                                 className="w-full px-2 py-1.5 text-xs font-mono border rounded bg-slate-100 text-slate-500"
                             />
                         </div>

                        <button 
                            onClick={() => deleteField(field.key)}
                            className="w-full py-2 mt-4 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100 transition flex items-center justify-center gap-2"
                        >
                            <Trash2 size={14} /> Alanı Sil
                        </button>
                    </div>
                ))}
            </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-900/50 relative p-8 flex justify-center items-start custom-scrollbar">
            {template.backgroundImage ? (
                <div 
                    ref={containerRef}
                    onClick={handleCanvasClick}
                    className="relative bg-white shadow-2xl transition-transform origin-top-left"
                    style={{ 
                        width: template.layout?.width || 'auto', 
                        height: template.layout?.height || 'auto',
                        transform: `scale(${zoom})`,
                        marginBottom: '400px', // Extra scrolling space
                        marginRight: '400px'
                    }}
                >
                    <img 
                        src={template.backgroundImage} 
                        alt="Background" 
                        onDragStart={e => e.preventDefault()}
                        className="w-full h-full object-contain pointer-events-none select-none"
                    />
                    
                    {/* Render Fields */}
                    {template.fields.filter(f => f.position).map(field => (
                        <div
                            key={field.key}
                            className={`absolute group cursor-move flex items-center justify-center border-2 transition-colors ${selectedFieldId === field.key ? 'border-blue-500 bg-blue-50/20' : 'border-indigo-400 border-dashed bg-indigo-50/10 hover:bg-indigo-50/30'}`}
                            style={{
                                left: field.position!.x,
                                top: field.position!.y,
                                width: field.position!.width,
                                height: field.position!.height,
                                zIndex: selectedFieldId === field.key ? 50 : 10
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFieldId(field.key);
                            }}
                            onMouseDown={(e) => {
                                if (e.target !== e.currentTarget) return; // Don't drag if resize handle clicked
                                const startX = e.clientX;
                                const startY = e.clientY;
                                const initialLeft = field.position!.x;
                                const initialTop = field.position!.y;
                                
                                const handleMouseMove = (moveEvent: MouseEvent) => {
                                    const dx = (moveEvent.clientX - startX) / zoom;
                                    const dy = (moveEvent.clientY - startY) / zoom;
                                    updateFieldPosition(field.key, initialLeft + dx, initialTop + dy);
                                };
                                
                                const handleMouseUp = () => {
                                    document.removeEventListener('mousemove', handleMouseMove);
                                    document.removeEventListener('mouseup', handleMouseUp);
                                };
                                
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                            }}
                        >
                            <span className="text-[10px] font-bold text-indigo-600 bg-white/80 px-1 rounded shadow-sm opacity-0 group-hover:opacity-100 absolute -top-4 w-max pointer-events-none">
                                {field.label}
                            </span>
                            
                            {/* Resize Handle */}
                            <div 
                                className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize opacity-0 group-hover:opacity-100"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    const initialWidth = field.position!.width;
                                    const initialHeight = field.position!.height;
                                    
                                    const handleMouseMove = (moveEvent: MouseEvent) => {
                                        const dx = (moveEvent.clientX - startX) / zoom;
                                        const dy = (moveEvent.clientY - startY) / zoom;
                                        updateFieldSize(field.key, Math.max(20, initialWidth + dx), Math.max(20, initialHeight + dy));
                                    };
                                    
                                    const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                    };
                                    
                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 h-96 border-2 border-dashed border-slate-300 rounded-xl w-full">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Başlamak için bir görsel yükleyin</p>
                    <p className="text-sm mb-4">Mevcut formunuzun resmini veya PDF'ini yükleyebilirsiniz.</p>
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
                        Dosya Seç
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            )}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 text-center">
          Görselin üzerine tıklayarak yeni alan ekleyin. Alanları sürükleyerek taşıyın ve köşesinden tutup boyutlandırın.
      </div>
    </div>
  );
};
