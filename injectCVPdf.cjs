const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server', 'index.cjs');
let serverCode = fs.readFileSync(serverPath, 'utf8');

const injectionPoint = '// Brand Header (Top Left)';
if (!serverCode.includes("templateId === 'cv-101'") && serverCode.includes(injectionPoint)) {
    const customCode = `
          if (templateId === 'cv-101') {
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

              doc.moveDown(1);
              doc.font('Helvetica-Bold').fontSize(24).fillColor('#2c3e50').text(tr(data.fullName) || 'Isimsiz', { align: 'center' });
              doc.moveDown(0.2);
              doc.font('Helvetica').fontSize(12).fillColor('#7f8c8d').text(tr(data.personalInfo) || '', { align: 'center' });
              doc.moveDown(1);
              
              doc.fontSize(10).fillColor('#333333');
              if (data.address) doc.text('Adres: ' + tr(data.address), { align: 'center' });
              
              const contactInfo = [];
              if (data.phone) contactInfo.push('Telefon: ' + tr(data.phone));
              if (data.email) contactInfo.push('Mail: ' + data.email);
              if (contactInfo.length > 0) doc.text(contactInfo.join(' | '), { align: 'center' });
              doc.moveDown(2);

              const renderSection = (title, contentField) => {
                  const content = data[contentField];
                  if (!content) return;
                  doc.font('Helvetica-Bold').fontSize(14).fillColor('#2980b9').text(title);
                  doc.moveTo(doc.x, doc.y).lineTo(545, doc.y).lineWidth(1).strokeColor('#2980b9').stroke();
                  doc.moveDown(0.5);
                  doc.font('Helvetica').fontSize(10).fillColor('#333333').text(tr(content), { align: 'left', lineGap: 3 });
                  doc.moveDown(1.5);
              };

              renderSection('PROFIL', 'profile');
              renderSection('SAHA VE OPERASYON DENEYIMI', 'fieldExperience');
              renderSection('KOORDINATORLUK VE ORGANIZASYON GOREVLERI', 'coordExperience');
              renderSection('EGITIM', 'education');
              renderSection('SERTIFIKA VE BELGELER', 'certificates');
              renderSection('YETKINLIKLER', 'skills');
              renderSection('IS DENEYIMI', 'workExperience');

              doc.end();
              return;
          }

          `;

    serverCode = serverCode.replace(injectionPoint, customCode + injectionPoint);
    fs.writeFileSync(serverPath, serverCode, 'utf8');
    console.log("Custom CV layout injected into server/index.cjs!");
} else {
    console.log("Already injected or injection point missing.");
}
