const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server', 'index.cjs');
let serverCode = fs.readFileSync(serverPath, 'utf8');

const photoInject = `
              // Photo Placeholder Area
              const photos = req.body.photos || [];
              if (photos && photos.length > 0 && photos[0]) {
                  try {
                      const imgBuf = Buffer.from(photos[0].split(',')[1], 'base64');
                      doc.image(imgBuf, 35, 40, { width: 120, height: 140, fit: [120, 140], align: 'center', valign: 'center' });
                      // Add border stroke
                      doc.rect(35, 40, 120, 140).lineWidth(1).strokeColor('#888').stroke();
                  } catch(e) {
                      doc.rect(35, 40, 120, 140).fill('#D1D5DB');
                  }
              } else {
                  doc.rect(35, 40, 120, 140).fill('#D1D5DB');
              }
`;

serverCode = serverCode.replace("doc.rect(35, 40, 120, 130).fill('#D1D5DB');", photoInject);

fs.writeFileSync(serverPath, serverCode, 'utf8');
console.log("Photo injected");
