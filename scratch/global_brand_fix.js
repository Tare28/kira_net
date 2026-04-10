const fs = require('fs');
const path = require('path');

const TARGET_FILES = [
  'app/rental-agreement.tsx',
  'app/report-listing.tsx',
  'app/list-property.tsx',
  'app/agent-dashboard.tsx',
  'app/landlord-dashboard.tsx',
  'app/field-inspection.tsx',
  'app/moving-services.tsx'
];

const NEW_PRIMARY = '#9CC942';
const DARK_TEXT = '#1A1A1A';

TARGET_FILES.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace legacy green
  content = content.replace(/#005C3A/g, NEW_PRIMARY);
  content = content.replace(/#006C45/g, NEW_PRIMARY);

  // Replace white text on buttons to dark
  // Simple heuristic: if it's 'color: "#FFF"' near words like "Btn", "Button", "Sign", "Submit"
  content = content.replace(/(BtnText|ButtonText|SignText|SubmitText|BtnLargeText|ActiveText|tabTextActive|confirmSignBtnText|signedTitle)[\s\S]{0,100}color:\s*['"]#FFF['"]/g, (m) => m.replace(/#FFF/g, DARK_TEXT));

  // Add import if missing
  if (content.includes('KiraColors') && !content.includes("from '@/constants/colors'")) {
     content = content.replace(/import\s+.*?router.*?from\s+['"]expo-router['"];/, (m) => m + "\nimport { KiraColors } from '@/constants/colors';");
  }

  // Final swap to use centralized KiraColors if literal hex is used in styles
  content = content.replace(/backgroundColor:\s*['"]#9CC942['"]/g, 'backgroundColor: KiraColors.primary');

  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
});
