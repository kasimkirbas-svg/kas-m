const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'public', 'templates');

function checkTemplates() {
  console.log('Checking for OSGB Document templates...');

  if (!fs.existsSync(templatesDir)) {
    console.error('❌ Requirements Not Met: The "public/templates" directory does not exist.');
    console.log('\n--- ACTION REQUIRED ---');
    console.log('Please extract the contents of "OSGB DÖKÜMANLARI (isgmerkezicomtr).rar".');
    console.log('Place the extracted .docx files into the following folder:');
    console.log(`➡️  ${templatesDir}`);
    console.log('-----------------------\n');
    process.exit(1);
  }

  const files = fs.readdirSync(templatesDir);
  const docxFiles = files.filter(f => f.endsWith('.docx'));

  if (docxFiles.length === 0) {
    console.warn('⚠️  Warning: The "public/templates" directory exists, but no .docx files were found inside.');
    console.log('Please make sure you extracted the files from the .rar archive directly into this directory.');
  } else {
    console.log(`✅ Success: Found ${docxFiles.length} document templates inside "public/templates".`);
    console.log('Document parsing logic is ready to run.');
    
    // List a few files as a sanity check
    docxFiles.slice(0, 5).forEach(f => console.log(`  - ${f}`));
    if (docxFiles.length > 5) {
      console.log(`  - ... and ${docxFiles.length - 5} more.`);
    }
  }
}

checkTemplates();
