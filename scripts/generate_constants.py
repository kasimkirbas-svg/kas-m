import os
import json

template_dir = r"c:\Users\kasim\OneDrive\Masaüstü\Yeni klasör\public\templates"

fields_map = {
    'Acil_Durum_Ekip_Atama.doc': [
        {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
        {'id': 'tarih', 'label': 'Tarih', 'type': 'date'},
        {'id': 'ekipBaskani', 'label': 'Ekip Başkanı', 'type': 'text'},
        {'id': 'ekipUyeleri', 'label': 'Ekip Üyeleri', 'type': 'textarea'}
    ],
    'Acil_Durum_Eylem_Plani_Sablon.doc': [
        {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
        {'id': 'hazirlayan', 'label': 'Hazırlayan', 'type': 'text'},
        {'id': 'onaylayan', 'label': 'Onaylayan', 'type': 'text'},
        {'id': 'tarih', 'label': 'Tarih', 'type': 'date'}
    ],
    'Calisan_Temsilcisi_Atama_Sablon.doc': [
        {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
        {'id': 'temsilciAdi', 'label': 'Çalışan Temsilcisi Adı', 'type': 'text'},
        {'id': 'temsilciGorevi', 'label': 'Görevi', 'type': 'text'},
        {'id': 'tarih', 'label': 'Tarih', 'type': 'date'}
    ],
    'Destek_Elemani_Atama_Sablon.doc': [
        {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
        {'id': 'elemanAdi', 'label': 'Destek Elemanı Adı', 'type': 'text'},
        {'id': 'destekKonusu', 'label': 'Destek Konusu', 'type': 'text'},
        {'id': 'tarih', 'label': 'Tarih', 'type': 'date'}
    ],
    'ISG_Kurul_Tutanagi_Sablon.doc': [
        {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
        {'id': 'toplantiNo', 'label': 'Toplantı No', 'type': 'text'},
        {'id': 'toplantiTarihi', 'label': 'Toplantı Tarihi', 'type': 'date'},
        {'id': 'alinanKararlar', 'label': 'Alınan Kararlar', 'type': 'textarea'}
    ],
    'Kaza_RamakKala_Bildirim_Detayli_Sablon.doc': [
        {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
        {'id': 'olayTarihi', 'label': 'Olay Tarihi', 'type': 'date'},
        {'id': 'olayYeri', 'label': 'Olay Yeri', 'type': 'text'},
        {'id': 'olayAciklamasi', 'label': 'Olay Açıklaması', 'type': 'textarea'}
    ],
    'Personel_ISG_Ihtar_Detayli_Sablon.doc': [
        {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
        {'id': 'personelAdi', 'label': 'Personel Adı', 'type': 'text'},
        {'id': 'ihtarNedeni', 'label': 'İhtar Nedeni', 'type': 'textarea'},
        {'id': 'tarih', 'label': 'Tarih', 'type': 'date'}
    ],
    'PKD_Sablon.doc': [
        {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
        {'id': 'hazirlayan', 'label': 'Hazırlayan', 'type': 'text'},
        {'id': 'dokumanNo', 'label': 'Doküman No', 'type': 'text'},
        {'id': 'tarih', 'label': 'Tarih', 'type': 'date'}
    ],
    'Yangindan_Korunma_Dokumani_Sablon.doc': [
         {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
        {'id': 'hazirlayan', 'label': 'Hazırlayan', 'type': 'text'},
        {'id': 'binaSorumlusu', 'label': 'Bina Sorumlusu', 'type': 'text'},
        {'id': 'tarih', 'label': 'Tarih', 'type': 'date'}
    ]
}

default_fields = [
    {'id': 'firmaAdi', 'label': 'Firma Adı', 'type': 'text', 'required': True},
    {'id': 'tarih', 'label': 'Tarih', 'type': 'date'},
    {'id': 'hazirlayan', 'label': 'Hazırlayan', 'type': 'text'},
    {'id': 'onaylayan', 'label': 'Onaylayan', 'type': 'text'}
]

mock_templates_str = "export const MOCK_TEMPLATES: DocumentTemplate[] = [\n"

try:
    files = os.listdir(template_dir)
    for i, file in enumerate(files):
        if file.endswith('.doc') or file.endswith('.docx'):
            id_name = file.rsplit('.', 1)[0]
            title = id_name.replace('_', ' ')
            file_path = f"/templates/{file}"
            
            fields_data = fields_map.get(file, default_fields)
            
            # format as javascript object string
            fields_str = json.dumps(fields_data).replace('"', "'")
            # a bit hacky to fix the python print true vs true
            fields_str = fields_str.replace("'required': true", "'required': true")
            fields_str = fields_str.replace("'required': True", "'required': true")
            
            mock_templates_str += f"{{ id: '{id_name}', title: '{title}', category: 'Dökümanlar', file: '{file_path}', fields: {fields_str} }}"
            if i < len(files) - 1:
                mock_templates_str += ",\n"
            else:
                mock_templates_str += "\n"
except FileNotFoundError:
    print(f"Error: directory not found {template_dir}")

mock_templates_str += "];\n"

print(mock_templates_str)

with open(r"c:\Users\kasim\OneDrive\Masaüstü\Yeni klasör\constants_updated.js", "w", encoding="utf-8") as f:
    f.write(mock_templates_str)
