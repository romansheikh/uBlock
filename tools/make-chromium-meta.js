const fs = require('fs');
const path = require('path');

const buildDir = process.argv[2];
if (!buildDir) {
  console.error('Build dir missing.');
  process.exit(1);
}

const projDir = path.join(__dirname, '..');
const version = fs.readFileSync(path.join(projDir, 'dist', 'version'), 'utf8').trim();

const manifestPath = path.join(buildDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.version = version;

// Development build?
if (/^\d+\.\d+\.\d+\.\d+$/.test(version)) {
  manifest.name += ' development build';
  manifest.short_name += ' dev build';
  
  // Guard browser_action / action for compatibility
  const actionKey = manifest.action ? 'action' : (manifest.browser_action ? 'browser_action' : null);
  if (actionKey && manifest[actionKey].default_title) {
    manifest[actionKey].default_title += ' dev build';
  }
}

// Format JSON cleanly and write back
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Manifest metadata updated to version ' + version);
