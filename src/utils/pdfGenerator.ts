import { jsPDF } from 'jspdf';
import { Invoice } from '../../types';

export const generateInvoicePDF = (invoice: Invoice, returnInstance: boolean = false): jsPDF | void => {
  // Create PDF document
  const doc = new jsPDF();
  
  // -- Fonts & Styling --
  // Note: Standard JS fonts don't support Turkish chars well. Using transliteration for safety.
  
  const tr = (text: string) => {
    if (!text) return "";
    return text
      .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
      .replace(/ş/g, 's').replace(/Ş/g, 'S')
      .replace(/ı/g, 'i').replace(/İ/g, 'I')
      .replace(/ç/g, 'c').replace(/Ç/g, 'C')
      .replace(/ö/g, 'o').replace(/Ö/g, 'O')
      .replace(/ü/g, 'u').replace(/Ü/g, 'U');
  };

  // -- Header --
  doc.setFontSize(22);
  doc.setTextColor(41, 128, 185); // Blue
  doc.text("KIRBAS DOKUMAN PANELİ", 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(tr("Profesyonel Dokuman Yonetim Sistemi"), 14, 28);
  
  doc.setDrawColor(200);
  doc.line(14, 32, 196, 32); // Horizontal Line

  // -- Invoice Details --
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("FATURA / INVOICE", 14, 45);

  doc.setFontSize(10);
  doc.text(`Fatura No: #${invoice.invoiceNumber}`, 14, 55);
  doc.text(`Tarih: ${new Date(invoice.date).toLocaleDateString()}`, 14, 60);
  doc.text(`Donem: ${tr(invoice.period || '-')}`, 14, 65);

  // -- Biller Info (Right Side) --
  const rightX = 120;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("SATICI:", rightX, 55);
  doc.setFont("helvetica", "normal");
  doc.text("Kirbas Yazilim ve Danismanlik", rightX, 60);
  doc.text("Teknopark Istanbul", rightX, 65);
  doc.text("Pendik / ISTANBUL", rightX, 70);
  doc.text("VKN: 1234567890", rightX, 75);

  // -- Customer Info --
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ALICI / CUSTOMER:", 14, 85);
  doc.setFont("helvetica", "normal");
  
  const bill = invoice.billingDetails || {} as any;
  doc.text(tr(bill.name || "Sayin Kullanici"), 14, 90);
  
  // Split long address
  // Check if splitTextToSize is available, otherwise assume it is or use simple split
  try {
     const addressLines = doc.splitTextToSize(tr(bill.address || "-"), 80);
     doc.text(addressLines, 14, 95);

     // Calculate Y position after address
     let currentY = 95 + (addressLines.length * 5);

     doc.text(`${tr(bill.city || "")} / ${tr(bill.country || "Turkiye")}`, 14, currentY);
     currentY += 5;
     
     const idLabel = bill.type === 'CORPORATE' ? 'Vergi No' : 'TCKN';
     doc.text(`${idLabel}: ${bill.taxId || "-"}`, 14, currentY);
     currentY += 5;

     if (bill.taxOffice) {
         doc.text(`V.D.: ${tr(bill.taxOffice)}`, 14, currentY);
         currentY += 5;
     }

      // -- Item Table Header --
      const tableY = Math.max(currentY + 10, 135);
      doc.setFillColor(240, 240, 240);
      doc.rect(14, tableY, 182, 8, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.text("HIZMET", 16, tableY + 6);
      doc.text("PLAN", 120, tableY + 6);
      doc.text("TUTAR", 170, tableY + 6);

      // -- Item Row --
      const rowY = tableY + 15;
      doc.setFont("helvetica", "normal");
      doc.text(tr("Premium Uyelik Hizmet Bedeli"), 16, rowY);
      doc.text(invoice.planType, 120, rowY);
      doc.text(`${invoice.amount} TL`, 170, rowY);

      doc.line(14, rowY + 5, 196, rowY + 5);

      // -- Total --
      const totalY = rowY + 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("GENEL TOPLAM:", 130, totalY);
      doc.text(`${invoice.amount} TL`, 170, totalY);
  } catch (e) {
      console.error("PDF Text Split Error", e);
      doc.text("Adres: " + tr(bill.address || "-"), 14, 95);
  }


  // -- Footer --
  const footerY = 280;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(tr("Isbu belge elektronik ortamda duzenlenmistir."), 105, footerY, { align: "center" });
  doc.text("www.kirbas-panel.com", 105, footerY + 5, { align: "center" });

  if (returnInstance) {
      return doc;
  }
  doc.save(`Fatura_${invoice.invoiceNumber}.pdf`);
};
