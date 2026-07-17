const fs = require('fs');
const file = 'pages/DocumentEditor.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/if \(step === 'selection'\) \{/, \if (step === 'preview') {
    return (
      <div className="flex flex-col h-full bg-slate-900 border-x border-slate-700">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <h2 className="text-lg font-semibold text-white">Önizleme: \</h2>
          <Button 
            onClick={() => setStep(primarySelectFields.length > 0 ? 'selection' : 'editor')} 
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Düzenlemeye Geç
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-slate-50 flex justify-center">
          <div ref={previewContainerRef} className="docx-preview-container bg-white shadow-xl w-[800px] min-h-[500px]" />
        </div>
      </div>
    );
  }

  if (step === 'selection') {\);
fs.writeFileSync(file, c);
