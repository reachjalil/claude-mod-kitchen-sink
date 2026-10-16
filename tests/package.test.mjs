import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
test('Cowork distribution is deterministic, allowlisted and carries its license',()=>{
 const output=execFileSync('python3',['-c',`
from pathlib import Path
from zipfile import ZipFile
import subprocess, hashlib
root=Path.cwd()
def build():
 subprocess.run(['python3','scripts/package-cowork.py'],check=True,capture_output=True)
 return (root/'dist/kitchen-cowork.zip').read_bytes()
a=build(); b=build(); assert a==b
with ZipFile(root/'dist/kitchen-cowork.zip') as z:
 assert z.testzip() is None
 assert set(z.namelist())=={'.claude-plugin/plugin.json','LICENSE','commands/tour.md','commands/experiment.md','examples/workshop-notes.md'}
 assert 'MIT License' in z.read('LICENSE').decode()
print('passed')
`],{cwd:root,encoding:'utf8'});
 assert.equal(output.trim(),'passed');
});
