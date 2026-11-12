# Changelog

All notable changes to the **EryScript Language Support** extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.8] - 2026-11-12

### Added

- `/probe` chat command in `examples/infinite_stamina.ery`. It tries every stamina write path one by one (0.6 s apart, each in its own call stack): `stamina`, `realStamina`, `exhaust(-100)`, `exhaust(100)`, `energyBuffer`, and `saveAllVitality` / `loadAllVitality`. Every attempt logs the value before and after to `Player.log`, and a failing member is reported by name, so the working write path can be identified without guessing.

---

## [2.0.7] - 2026-11-12

### Fixed

- The example no longer relies on the `InfiniteStamina_Loop` flag in `GlobalVars`. That flag survives a mod reload, so after reloading mods the old version returned early from `EnsureLoop` and the timer never restarted. `OnModLoadedCallback` now always clears the player list and starts a fresh timer.

### Added

- `examples/infinite_stamina.ery` writes a diagnostic line to `Player.log` every three seconds: tracked player count, refill count, current `stamina` and `health`. Every refill also logs the value before and after the write, which shows whether the stamina setter actually takes effect.

---

## [2.0.6] - 2026-11-12

### Fixed

- `examples/infinite_stamina.ery`: `OnPlayerCreatedCallback(view, player)` receives a Photon view, not the player model, so calling `view.life` raised `Exception: Member not found: life`. The example now resolves the model with `NetworkUserList.getModelFromPlayer(view.Owner)` before touching any life component.

### Changed

- The example reads and writes stamina through the model's `lifeLocal` component (as in the official Erythros wiki examples), falling back to `life` only when `lifeLocal` is empty.
- The host is tracked explicitly through `MyNetwork.LocalPlayer` one and five seconds after the mod loads, so a solo host is served even when no `OnPlayerConnectedServerCallback` fires for the local player.

---

## [2.0.5] - 2026-11-12

### Fixed

- `examples/infinite_stamina.ery` no longer calls `life.SetStamina()`. Inspecting the running game showed that `Keyneed.Life` exposes stamina as the `stamina` property (`get_stamina` / `set_stamina`) and has no `SetStamina()` method, so the previous version always raised `Exception: Method not found: Keyneed.Life.SetStamina` and stopped the timer.
- The timer is re-armed at the beginning of `StaminaTick`, so one failing tick can no longer stop stamina restoration.
- Removed the `try/catch` blocks around member access. The EryScript engine raises reflection errors outside the script `try`, so they never suppressed anything and only hid the real problem.

### Changed

- `examples/infinite_stamina.ery` refills `life.stamina` to `staminaTarget` (100) when it drops below `staminaThreshold` (50) and updates `view.lifeLocal` as well, so the local player's stamina bar stays full.
- The loop now ticks every 0.5 s, and `/stamina` reports the number of refills in addition to the player count and the current stamina value.

---

## [2.0.4] - 2026-11-12

### Fixed

- `examples/infinite_stamina.ery`: the loop no longer returns early when `MyNetwork.IsMasterClient` is `false` during `OnModLoadedCallback`. At mod load the network is not initialised yet, so the check blocked the timer and `/stamina` kept reporting `mode: detecting`. The loop now starts from `OnModLoadedCallback` and is re-armed from `OnPlayerConnectedServerCallback` / `OnPlayerRespawnedServerCallback`.
- All `GlobalVars` and `life` access is wrapped in `try/catch` so a missing member cannot raise a red exception in the game log.

### Changed

- Stamina is restored only when the current value drops below `staminaThreshold` (50 by default). If the value cannot be read, the example refills on every tick as before.
- `/stamina` now also prints the current stamina value, which makes it easier to see whether `life.stamina` is readable.

---

## [2.0.3] - 2026-11-12

### Fixed

- `examples/infinite_stamina.ery`: the respawn handler no longer calls `view.lifeLocal`. `OnPlayerRespawnedServerCallback(view, life)` already receives the `Life` component, so the example now calls `RefillLife(life)` and avoids the in-game `Exception: Member not found: lifeLocal`.
- The `lifeLocal` lookup in `RefillPlayer` is wrapped in `try/catch`, so players whose view has no life component are skipped instead of spamming the game log.

### Changed

- Stamina is now restored with the `SetStamina()` script method first. If the method is missing, the example falls back to the `life.stamina` field and finally to healing only. The working mode is detected once, cached in `GlobalVars` and shown by the `/stamina` chat command.

---

## [2.0.2] - 2026-11-12

### Added

- `examples/infinite_stamina.ery` — a complete, ready-to-paste mod that keeps health topped up and refills stamina every second. It tracks players across connect, spawn, respawn and disconnect events, uses `MyAsync.WaitForSeconds` for the loop and reports status via the `/stamina` chat command.
- README section **Example mod** with a walkthrough of the example and a code excerpt.

### Fixed

- README quick-start callback now matches the real signature `OnPlayerConnectedServerCallback(connId)`.
- README now documents the `eryscript.autoComplete` setting and shows the current version.

---

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
