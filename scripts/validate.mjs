import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
for (const target of ['plugins/kitchen-sink', 'plugins/kitchen-cowork', '.claude-plugin/marketplace.json']) {
  const run = spawnSync('claude', ['plugin', 'validate', '--strict', target], { cwd: root, stdio: 'inherit' });
  if (run.error) { console.error('Install Claude Code to run native validation:', run.error.message); process.exit(1); }
  if (run.status !== 0) process.exit(run.status ?? 1);
}
