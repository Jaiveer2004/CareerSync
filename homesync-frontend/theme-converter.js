const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      if (!['node_modules', '.git', '.next', '.vercel'].includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Backgrounds
    content = content.replace(/bg-gray-900/g, 'bg-slate-50');
    content = content.replace(/bg-gray-800/g, 'bg-white');
    content = content.replace(/bg-gray-700/g, 'bg-slate-100');
    content = content.replace(/bg-gray-600/g, 'bg-slate-200');

    // Text colors
    content = content.replace(/text-white/g, 'text-slate-900');
    // We might have changed text-white to text-slate-900, but buttons usually need text-white. We'll handle buttons manually or with a better approach.
    // Actually, simple replace is dangerous for text-white since it ruins primary buttons. Let's be smarter.
    
    // Borders
    content = content.replace(/border-gray-700/g, 'border-slate-200');
    content = content.replace(/border-gray-600/g, 'border-slate-300');
    content = content.replace(/border-gray-800/g, 'border-slate-100');

    // Muted text
    content = content.replace(/text-gray-400/g, 'text-slate-500');
    content = content.replace(/text-gray-500/g, 'text-slate-600');
    content = content.replace(/text-gray-300/g, 'text-slate-600');

    // Accents
    content = content.replace(/bg-blue-600/g, 'bg-[#1e40af]'); // deep blue button
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#1e3a8a]');
    content = content.replace(/text-blue-400/g, 'text-[#1e40af]');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
