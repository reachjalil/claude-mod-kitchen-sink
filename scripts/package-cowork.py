"""Make a deterministic plugin ZIP. No credentials, generated files or dependencies."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
source = root / "plugins/kitchen-cowork"
target = root / "dist/kitchen-cowork.zip"
target.parent.mkdir(exist_ok=True)
with ZipFile(target, "w", compression=ZIP_DEFLATED) as archive:
    # An explicit public-file list excludes editor files, secrets and symlinks.
    members = [".claude-plugin/plugin.json", "LICENSE", "commands/tour.md",
               "commands/experiment.md", "examples/workshop-notes.md"]
    for member in sorted(members):
        path = source / member
        if path.is_symlink() or not path.is_file():
            raise ValueError(f"Expected a regular public plugin file: {member}")
        if not path.resolve().is_relative_to(source.resolve()):
            raise ValueError(f"Plugin member escaped its source: {member}")
        info = ZipInfo(member, (2026, 1, 1, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        archive.writestr(info, path.read_bytes())
print(target)
