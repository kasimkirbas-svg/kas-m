const fs = require('fs');
const path = require('path');

const templateDir = path.join(__dirname, '..', 'public', 'templates');

const fieldsMap = {
    'Acil_Durum_Ekip_Atama.doc': [
        {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
        {id: 'tarih', label: 'Tarih', type: 'date'},
        {id: 'ekipBaskani', label: 'Ekip Başkanı', type: 'text'},
        {id: 'ekipUyeleri', label: 'Ekip Üyeleri', type: 'textarea'}
    ],
    'Acil_Durum_Eylem_Plani_Sablon.doc': [
        {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
        {id: 'hazirlayan', label: 'Hazırlayan', type: 'text'},
        {id: 'onaylayan', label: 'Onaylayan', type: 'text'},
        {id: 'tarih', label: 'Tarih', type: 'date'}
    ],
    'Calisan_Temsilcisi_Atama_Sablon.doc': [
        {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
        {id: 'temsilciAdi', label: 'Çalışan Temsilcisi Adı', type: 'text'},
        {id: 'temsilciGorevi', label: 'Görevi', type: 'text'},
        {id: 'tarih', label: 'Tarih', type: 'date'}
    ],
    'Destek_Elemani_Atama_Sablon.doc': [
        {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
        {id: 'elemanAdi', label: 'Destek Elemanı Adı', type: 'text'},
        {id: 'destekKonusu', label: 'Destek Konusu', type: 'text'},
        {id: 'tarih', label: 'Tarih', type: 'date'}
    ],
    'ISG_Kurul_Tutanagi_Sablon.doc': [
        {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
        {id: 'toplantiNo', label: 'Toplantı No', type: 'text'},
        {id: 'toplantiTarihi', label: 'Toplantı Tarihi', type: 'date'},
        {id: 'alinanKararlar', label: 'Alınan Kararlar', type: 'textarea'}
    ],
    'Kaza_RamakKala_Bildirim_Detayli_Sablon.doc': [
        {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
        {id: 'olayTarihi', label: 'Olay Tarihi', type: 'date'},
        {id: 'olayYeri', label: 'Olay Yeri', type: 'text'},
        {id: 'olayAciklamasi', label: 'Olay Açıklaması', type: 'textarea'}
    ],
    'Personel_ISG_Ihtar_Detayli_Sablon.doc': [
        {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
        {id: 'personelAdi', label: 'Personel Adı', type: 'text'},
        {id: 'ihtarNedeni', label: 'İhtar Nedeni', type: 'textarea'},
        {id: 'tarih', label: 'Tarih', type: 'date'}
    ],
    'PKD_Sablon.doc': [
        {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
        {id: 'hazirlayan', label: 'Hazırlayan', type: 'text'},
        {id: 'dokumanNo', label: 'Doküman No', type: 'text'},
        {id: 'tarih', label: 'Tarih', type: 'date'}
    ],
    'Yangindan_Korunma_Dokumani_Sablon.doc': [
         {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
        {id: 'hazirlayan', label: 'Hazırlayan', type: 'text'},
        {id: 'binaSorumlusu', label: 'Bina Sorumlusu', type: 'text'},
        {id: 'tarih', label: 'Tarih', type: 'date'}
    ]
};

const defaultFields = [
    {id: 'firmaAdi', label: 'Firma Adı', type: 'text', required: true},
    {id: 'tarih', label: 'Tarih', type: 'date'},
    {id: 'hazirlayan', label: 'Hazırlayan', type: 'text'},
    {id: 'onaylayan', label: 'Onaylayan', type: 'text'}
];

let mockTemplatesStr = "export const MOCK_TEMPLATES: DocumentTemplate[] = [\n";

try {
    const files = fs.readdirSync(templateDir);
    const docFiles = files.filter(f => f.endsWith('.doc') || f.endsWith('.docx'));
    
    docFiles.forEach((file, index) => {
        const idName = file.substring(0, file.lastIndexOf('.'));
        const title = idName.replace(/_/g, ' ');
        const filePath = `/templates/${file}`;
        
        let fieldsData = fieldsMap[file] || defaultFields;
        
        const fieldsStr = JSON.stringify(fieldsData).replace(/"/g, "'");
        
        mockTemplatesStr += `{ id: '${idName}', title: '${title}', category: 'Dökümanlar', file: '${filePath}', fields: ${fieldsStr} }`;
        if (index < docFiles.length - 1) {
            mockTemplatesStr += ",\n";
        } else {
            mockTemplatesStr += "\n";
        }
    });

} catch (err) {
    console.error(`Error reading directory: ${err}`);
}

mockTemplatesStr += "];\n";

const constantsPath = path.join(__dirname, '..', 'constants.tsx');
let constantsContent = fs.readFileSync(constantsPath, 'utf-8');

const regex = /export const MOCK_TEMPLATES: DocumentTemplate\[\] = \[\s*([\s\S]*?)\];/;
constantsContent = constantsContent.replace(regex, mockTemplatesStr.trim());

fs.writeFileSync(constantsPath, constantsContent, 'utf-8');

console.log("Updated constants.tsx");
