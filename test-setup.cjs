// Quick setup verification script
const fs = require('fs');
const path = require('path');

console.log('🔍 XENDERCROSS Setup Verification\n');

// Check critical files and directories
const checks = [
  { path: 'backend/package.json', type: 'file', desc: 'Backend package.json' },
  { path: 'backend/.env', type: 'file', desc: 'Backend environment file' },
  { path: 'backend/uploads', type: 'dir', desc: 'Uploads directory' },
  { path: 'backend/src/server.ts', type: 'file', desc: 'Backend server' },
  { path: 'src/lib/api.ts', type: 'file', desc: 'Frontend API config' },
  { path: 'package.json', type: 'file', desc: 'Frontend package.json' }
];

let allGood = true;

checks.forEach(check => {
  const fullPath = path.join(__dirname, check.path);
  const exists = fs.existsSync(fullPath);
  const isCorrectType = check.type === 'dir' ? 
    (exists && fs.statSync(fullPath).isDirectory()) :
    (exists && fs.statSync(fullPath).isFile());
  
  const status = exists && isCorrectType ? '✅' : '❌';
  console.log(`${status} ${check.desc}: ${check.path}`);
  
  if (!exists || !isCorrectType) {
    allGood = false;
  }
});

// Check for SQLite dependency
try {
  const backendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend/package.json'), 'utf8'));
  const hasSQLite = backendPkg.dependencies && backendPkg.dependencies.sqlite3;
  console.log(`${hasSQLite ? '✅' : '❌'} SQLite dependency: ${hasSQLite ? 'Present' : 'Missing'}`);
  if (!hasSQLite) allGood = false;
} catch (e) {
  console.log('❌ Could not check SQLite dependency');
  allGood = false;
}

console.log('\n' + (allGood ? '🎉 All checks passed! Ready to run.' : '⚠️  Some issues found. Please fix before running.'));

if (allGood) {
  console.log('\n📋 Next steps:');
  console.log('1. npm run install:all');
  console.log('2. npm run dev:full');
  console.log('3. Visit http://localhost:5173');
}