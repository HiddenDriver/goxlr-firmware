// Dependency-free approved-workflow guard. Run from the repository root.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'ci-workflows.json'), 'utf8'));
const folder = path.join(__dirname, 'workflows');
const actual = fs.existsSync(folder) ? fs.readdirSync(folder).filter(p => /\.ya?ml$/i.test(p)).map(p => '.github/workflows/' + p).sort() : [];
const expected = Object.keys(manifest.workflows).sort();
const errors = [];
if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push('Workflow inventory changed; explicit owner authorization is required.');
for (const name of actual) {
  const digest = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n/g, '\n')).digest('hex');
  if (digest !== manifest.workflows[name]) errors.push('Unapproved workflow: ' + name);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('CI policy: approved workflow inventory verified (' + actual.length + ' workflows).');
