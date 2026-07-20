const fs = require('fs');
let c = fs.readFileSync('App.tsx', 'utf8');
c = c.replace(/\\n/g, '\n');
fs.writeFileSync('App.tsx', c);
console.log('Fixed newlines');
