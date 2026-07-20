const fs = require('fs');
let c = fs.readFileSync('App.tsx', 'utf8');

const startStr = '            {/* Header Layout Engine - Redesigned Grid */}';
const endStr = '{/* SEKTÖREL BAÐLANTILAR */}';

const startIdx = c.indexOf(startStr);
const endIdx = c.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = "            {/* Header Layout Engine - Search Only */}\n" +
                      "            <div className=\"mb-8 relative z-10 flex border border-slate-300 dark:border-white/10 p-2 shadow-inner rounded focus-within:border-[#FFD700]/50 transition-colors bg-lightbox dark:bg-darkbox/40 items-center justify-between\">\n" +
                      "              <div className=\"flex items-center gap-4 w-full\">\n" +
                      "                <Search className=\"w-5 h-5 text-[#FFD700] ml-3 shrink-0\" />\n" +
                      "                <input type=\"text\" placeholder=\"ARÞÝVDE ARAYIN...\" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className=\"w-full bg-transparent border-none px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-600 focus:outline-none font-bold tracking-wide text-xs\"/>\n" +
                      "                {searchQuery && (<button onClick={() => setSearchQuery('')} className=\"pr-3 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors\"><Hexagon className=\"w-4 h-4\" /></button>)}\n" +
                      "              </div>\n" +
                      "            </div>\n\n           ";
  
  c = c.substring(0, startIdx) + replacement + c.substring(endIdx);
  fs.writeFileSync('App.tsx', c);
  console.log('Success');
} else {
  console.log('Hooks not found. start: ' + startIdx + ', end: ' + endIdx);
}
