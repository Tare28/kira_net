const fs = require('fs');
const path = require('path');

const appDir = path.join(process.cwd(), 'app');
const files = fs.readdirSync(appDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const fullPath = path.join(appDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  if (content.includes('KiraColors') && !content.includes("from '@/constants/colors'")) {
    console.log(`Fixing ${file}`);
    // Try to find router import to insert after
    if (content.includes("from 'expo-router'")) {
      content = content.replace(/(import\s+.*?from\s+['"]expo-router['"];?)/, "$1\nimport { KiraColors } from '@/constants/colors';");
    } else {
      // Just put it at the top after React
      content = content.replace(/(import\s+React.*?from\s+['"]react['"];?)/, "$1\nimport { KiraColors } from '@/constants/colors';");
    }
    fs.writeFileSync(fullPath, content);
  }
});
