# Security and data

Mods execute with the host user's machine access. They are not a sandbox. Review code and `claude plugin validate` output before loading a mod. Validation inventories capabilities; it does not establish safety or correct behavior.

This mod calls command registration, tool registration, UI methods, prompt draft filling, surface inspection, and its own plugin store. It does not call network, process, environment, arbitrary filesystem, model, or session-messaging APIs. It does not auto-approve permission requests. The imaginary tool guard is an educational example and provides no general protection for shell commands or other plugins.

Only a manually saved scratch note persists. Treat the plugin store as unencrypted local data. Notes are shared across this plugin's local sessions; the last save wins. Generic event labels are bounded and memory-only. Prompts and tool contents are not copied to a log. Normal Claude host behavior and retention remain outside this project's control.

The Cowork commands use normal model usage when invoked. They request conversational output and require user instruction before file writes. Model instructions are not a security boundary; retain normal host permissions.

Use synthetic data when experimenting or reporting bugs. Remove secrets, real conversations, local paths and customer data from reports. Until a public repository security-reporting channel is configured, do not publish sensitive exploit details or private data in an issue.
