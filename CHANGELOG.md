# Changelog

All notable changes to the **EryScript Language Support** extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
