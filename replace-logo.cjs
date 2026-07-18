const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const logoUrl = "https://txlbsxwuaumjsewizzzz.supabase.co/storage/v1/object/public/logo/logo.png";

const replacePairs = [
  {
    find: /<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-dark flex items-center justify-center shadow-lg shadow-accent-primary\/20">\s*<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"><\/path><\/svg>\s*<\/div>/g,
    replace: ` {/* eslint-disable-next-line @next/next/no-img-element */}\n                <img src="${logoUrl}" alt="RealDoor Logo" className="w-10 h-10 object-contain" />`
  },
  {
    find: /<div className="w-8 h-8 rounded-\[10px\] bg-gradient-to-br from-accent-primary to-accent-dark flex items-center justify-center shadow-sm">\s*<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"><\/path><\/svg>\s*<\/div>/g,
    replace: ` {/* eslint-disable-next-line @next/next/no-img-element */}\n                <img src="${logoUrl}" alt="RealDoor Logo" className="w-8 h-8 object-contain" />`
  },
  {
    find: /<div className="w-12 h-12 rounded-xl bg-accent-primary mx-auto flex items-center justify-center shadow-lg shadow-accent-primary\/20 mb-4">\s*<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"><\/path><\/svg>\s*<\/div>/g,
    replace: ` {/* eslint-disable-next-line @next/next/no-img-element */}\n          <img src="${logoUrl}" alt="RealDoor Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />`
  }
];

const files = walk('app');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;
  
  replacePairs.forEach(pair => {
    content = content.replace(pair.find, pair.replace);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    console.log(`Updated logo in: ${f}`);
  }
});
