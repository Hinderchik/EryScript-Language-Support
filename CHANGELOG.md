# Changelog

All notable changes to the **EryScript Language Support** extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2026-11-11

### Changed

- Cleaned up `README.md` for the Visual Studio Marketplace: removed installation-from-local-VSIX instructions, local install scripts and internal publishing notes.
- The documentation now links directly to the Marketplace page (`XunKal1.eryscript`) and points feature requests to the GitHub issue tracker.
- Updated publisher ID in `package.json` from `keyneed` to `xunkal1`.

### Removed

- `PUBLISHING.md` — kept only for local use, not shipped in the package.
- Local install helpers (`install.bat`, `install.js`). Users should install via the Marketplace or `Extensions: Install from VSIX...` inside VS Code.

---

## [2.0.0] - 2026-11-11

### Added

- Syntax highlighting for keywords, callbacks, engine classes, dot-methods, dot-properties, strings and numbers.
- Comment support for `//` line comments and `/* */` block comments.
- IntelliSense with signature snippets for 23 keywords, 8 callbacks, 32 engine classes, 40+ methods and 30+ properties.
- Diagnostics for missing `mend` and `end`, duplicate methods, wrong keyword casing and deprecated `print()`.
- 13 code snippets covering methods, conditions, loops, error handling, callbacks and a full mod template.
- `EryScript: Validate EryScript Document` and `EryScript: Open EryScript Documentation` commands.
- Custom **EryScript Icon Theme** for `.ery` and `.eryscript` files.
- Extension settings `eryscript.enableDiagnostics` and `eryscript.autoApplyIconTheme`.

### Changed

- Snippet syntax now matches the official EryScript reference (no trailing colons, `try/catch` closed with `end`).
- Grammar rewritten to follow the documented comment style and keyword set.

### Fixed

- Completion items no longer produce invalid declarations for engine classes.
- Diagnostics are recalculated when a document is reopened or switched.

## [1.0.0] - 2026-11-10

### Added

- Initial release with basic syntax highlighting, snippets and the `.ery` file association.
