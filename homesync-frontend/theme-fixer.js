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

    // Convert "text-white" to "text-slate-900" globally EXCEPT when it co-occurs with bg-[#1e40af] in the same tag.
    // That's tricky. Instead, let's just make it slate globally, and then restore text-white for anything with bg-[#1e40af].
    content = content.replace(/text-white/g, 'text-slate-900');
    
    // Now any class containing bg-[#1e40af] should have text-slate-900 converted to text-white
    content = content.replace(/(className="[^"]*bg-\[#1e40af\][^"]*)text-slate-900([^"]*")/g, '$1text-white$2');
    
    // Also, gradients. Sometimes we want text-white on gradients.
    content = content.replace(/(className="[^"]*bg-gradient-to-[a-z]+ from-blue-[0-9]+[^"]*)text-slate-900([^"]*")/g, '$1text-white$2');

    // Also the dark footers shouldn't be touched. Better to leave text-slate-900 generally and just let it be. But wait, footer might still be bg-slate-900 if I didn't change it. No, I made ALL bg-gray-900 into bg-slate-50. So footer is now light. So text-slate-900 is correct for footer!

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});
