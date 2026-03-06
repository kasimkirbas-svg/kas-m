const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server', 'index.cjs');
let serverCode = fs.readFileSync(serverPath, 'utf8');

// We need to replace the old if (templateId === 'cv-101') block with the new one.
// Let's use regex to find and replace the block.
const rx = /if \(templateId === 'cv-101'\) \{[\s\S]*?doc\.end\(\);\s*return;\s*\}/;

const newBlock = `if (templateId === 'cv-101') {
              const tr = (str) => {
                  if (!str) return "";
                  return String(str)
                    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
                    .replace(/ş/g, 's').replace(/Ş/g, 'S')
                    .replace(/ı/g, 'i').replace(/İ/g, 'I')
                    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
                    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
                    .replace(/ü/g, 'u').replace(/Ü/g, 'U');
              };

              // Document boundaries
              const docWidth = doc.page.width;
              const docHeight = doc.page.height;
              const leftColWidth = 190;
              const rightColX = leftColWidth + 30;
              const rightColWidth = docWidth - rightColX - 30;

              // Draw Left Column Background
              doc.rect(0, 0, leftColWidth, docHeight).fill('#EAECEE');
              
              // Colors
              const primaryColor = '#1F3864'; // Dark Blue
              const darkText = '#333333';
              const lightText = '#555555';
              const lineColor = '#B0B8C1';

              // Helper for Titles in Left Column
              const leftTitle = (yPos, title) => {
                  doc.font('Helvetica-Bold').fontSize(11).fillColor(primaryColor).text(tr(title), 20, yPos);
                  doc.moveTo(20, yPos + 14).lineTo(leftColWidth - 20, yPos + 14).lineWidth(1).strokeColor(lineColor).stroke();
                  return yPos + 22;
              };

              // Helper for Titles in Right Column
              const rightTitle = (yPos, title) => {
                  doc.font('Helvetica-Bold').fontSize(12).fillColor(darkText).text(tr(title), rightColX, yPos);
                  doc.moveTo(rightColX, yPos + 14).lineTo(docWidth - 30, yPos + 14).lineWidth(1).strokeColor(lineColor).stroke();
                  return yPos + 22;
              };

              let leftY = 200; // Start below the photo area (we leave space for a photo)

              // Photo Placeholder Area (Grey box)
              doc.rect(35, 40, 120, 130).fill('#D1D5DB');

              // LEFT COLUMN CONTENT
              // Kisisel Bilgiler
              if (data.personalInfo) {
                  leftY = leftTitle(leftY, 'KISISEL BILGILER');
                  
                  // Try to split logic if it contains ' - ' like "10.01.1982 - Evli, 4 Cocuk"
                  const parts = data.personalInfo.split('-');
                  if(parts.length >= 2) {
                      doc.font('Helvetica-Bold').fontSize(9).fillColor(darkText).text('Dogum Tarihi', 20, leftY);
                      leftY += 12;
                      doc.font('Helvetica').fontSize(9).fillColor(lightText).text(tr(parts[0].trim()), 20, leftY);
                      leftY += 18;
                      
                      doc.font('Helvetica-Bold').fontSize(9).fillColor(darkText).text('Medeni Durum', 20, leftY);
                      leftY += 12;
                      doc.font('Helvetica').fontSize(9).fillColor(lightText).text(tr(parts.slice(1).join('-').trim()), 20, leftY);
                      leftY += 25;
                  } else {
                      doc.font('Helvetica').fontSize(9).fillColor(lightText).text(tr(data.personalInfo), 20, leftY, { width: leftColWidth - 40 });
                      leftY = doc.y + 20;
                  }
              }

              // Iletisim
              leftY = leftTitle(leftY, 'ILETISIM');
              doc.font('Helvetica-Bold').fontSize(9).fillColor(darkText);
              
              if(data.phone) {
                  doc.text('Tel: ' + tr(data.phone), 20, leftY);
                  leftY += 16;
              }
              if(data.email) {
                  doc.text('E-posta: ' + tr(data.email), 20, leftY, { width: leftColWidth - 40 });
                  leftY = doc.y + 8;
              }
              if(data.address) {
                  doc.text('Adres:', 20, leftY);
                  leftY += 12;
                  doc.font('Helvetica').fontSize(8).fillColor(lightText).text(tr(data.address), 20, leftY, { width: leftColWidth - 40 });
                  leftY = doc.y + 20;
              }

              // Yetkinlikler
              if (data.skills) {
                  leftY = leftTitle(leftY, 'YETKINLIKLER');
                  const skillsList = data.skills.split('\\n');
                  doc.font('Helvetica').fontSize(9).fillColor(darkText);
                  skillsList.forEach(s => {
                      if(s.trim()) {
                          doc.circle(23, leftY + 4, 2).fill(darkText);
                          doc.text(tr(s.trim()), 30, leftY, { width: leftColWidth - 50 });
                          leftY += 14;
                      }
                  });
              }

              // RIGHT COLUMN CONTENT
              let rightY = 40;
              doc.font('Helvetica-Bold').fontSize(32).fillColor(primaryColor).text(tr(data.fullName) || 'ISIMSIZ', rightColX, rightY, { width: rightColWidth });
              rightY = doc.y + 4;
              
              const jobTitle = "BELEDIYE SAHA VE KOORDINASYON UZMANI"; // we can hardcode for this example or take from a field
              doc.font('Helvetica').fontSize(11).fillColor(darkText).text(tr(jobTitle), rightColX, rightY);
              rightY += 30;

              const renderRightSection = (title, content, bullet = false) => {
                  if(!content) return;
                  rightY = rightTitle(rightY, title);
                  
                  doc.font('Helvetica').fontSize(10).fillColor(darkText);
                  if (bullet) {
                      const lines = content.split('\\n');
                      lines.forEach(l => {
                          if (l.trim()) {
                              // If it already has an asterisk, remote it
                              let txt = l.replace(/^\\*/, '').trim();
                              doc.circle(rightColX + 3, rightY + 4, 2).fill(darkText);
                              doc.text(tr(txt), rightColX + 10, rightY, { width: rightColWidth - 10, align: 'justify' });
                              rightY = doc.y + 4;
                          }
                      });
                  } else {
                      doc.text(tr(content), rightColX, rightY, { width: rightColWidth, align: 'justify' });
                      rightY = doc.y;
                  }
                  rightY += 15;
              };

              renderRightSection('PROFIL', data.profile, false);
              renderRightSection('SAHA VE OPERASYON DENEYIMI', data.fieldExperience, true);
              renderRightSection('KOORDINATORLUK VE ORGANIZASYON GOREVLERI', data.coordExperience, true);
              renderRightSection('EGITIM', data.education, false);
              renderRightSection('SERTIFIKA VE BELGELER', data.certificates, true);
              renderRightSection('IS DENEYIMI', data.workExperience, false);

              doc.end();
              return;
          }`;

if (rx.test(serverCode)) {
  serverCode = serverCode.replace(rx, newBlock);
} else {
  // Try to find the injection point again and insert
  const ip = '// Brand Header (Top Left)';
  serverCode = serverCode.replace(ip, newBlock + "\n\n          " + ip);
}

fs.writeFileSync(serverPath, serverCode, 'utf8');
console.log("Updated cv-101 PDF generation layout.");