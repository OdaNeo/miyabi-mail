const fs = require('fs');
const path = require('path');

function updateVersions(dir, newVersion) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') {
        updateVersions(fullPath, newVersion);
      }
    } else if (entry.isFile() && entry.name === 'package.json') {
      try {
        const json = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        const currentVersion = json.version || '0.0.0';
        if (currentVersion !== newVersion) {
          json.version = newVersion;
          fs.writeFileSync(fullPath, JSON.stringify(json, null, 2) + '\n');
        }
      } catch {
        console.error(`Failed to parse JSON in ${fullPath}`);
      }
    }
  }
}

const rootPkgPath = path.join(process.cwd(), 'package.json');
let rootVersion = null;
try {
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
  rootVersion = rootPkg.version;
} catch {
  console.error('Failed to parse root package.json');
  process.exit(1);
}

if (!rootVersion || !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(rootVersion)) {
  console.error(`Root version <${rootVersion}> isn't correct, proper format is <0.0.0>`);
  process.exit(1);
}

updateVersions(process.cwd(), rootVersion);
console.log(`Updated all package.json to version ${rootVersion}`);
