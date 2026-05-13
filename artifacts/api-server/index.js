import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const child = spawn('node', [path.join(__dirname, 'dist/index.mjs')], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => { process.exit(code); });