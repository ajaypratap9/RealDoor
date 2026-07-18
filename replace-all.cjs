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
const imgTag = `{/* eslint-disable-next-line @next/next/no-img-element */}\n                <img src="${logoUrl}" alt="RealDoor Logo" className="w-10 h-10 object-contain" />`;

// Matches the SVG path for the house logo wrapped in any div
const regex = /<div className="[^"]*">\s*<svg[^>]*>\s*<path[^>]*d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"[^>]*><\/path>\s*<\/svg>\s*<\/div>/g;

const files = walk('app');
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(regex, imgTag);
  if (content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log(`Updated logo in: ${f}`);
    count++;
  }
});
console.log(`Total files updated: ${count}`);
