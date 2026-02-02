#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔍 Scanning for secrets...');

const secretPatterns = [
  { name: 'Private Key', regex: /-----BEGIN [A-Z]+ PRIVATE KEY-----/ },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Generic Secret Assignment', regex: /(api_key|access_token|secret_key|auth_token)\s*[:=]\s*['"]([a-zA-Z0-9_\-]{8,})['"]/i },
];

try {
  // Get list of staged files
  const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean);

  let hasSecrets = false;

  for (const file of stagedFiles) {
    if (!fs.existsSync(file)) continue;
    if (file.includes('check-secrets.cjs')) continue; // Skip self

    const content = fs.readFileSync(file, 'utf-8');
    
    for (const { name, regex } of secretPatterns) {
      if (regex.test(content)) {
        console.error(`❌ Potential secret found in ${file}: ${name}`);
        hasSecrets = true;
      }
    }
  }

  if (hasSecrets) {
    console.error('🚫 Commit blocked due to potential secrets.');
    process.exit(1);
  } else {
    console.log('✅ No secrets found.');
  }

} catch (error) {
  console.error('Error running secret scan:', error);
  process.exit(1);
}