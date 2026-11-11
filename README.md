# EryScript Language

![EryScript icon](EryScript_Icon.png)

[![License: MIT](https://img.shields.io/badge/license-MIT-2ea44f.svg)](LICENSE.md)
[![Version](https://img.shields.io/badge/version-2.0.0-2ea44f.svg)](CHANGELOG.md)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.80%2B-007ACC.svg)](https://code.visualstudio.com/)

Full language support for **EryScript**, the scripting language used to mod **Erythros Lite**.
Syntax highlighting, IntelliSense, diagnostics, snippets and custom file icons — everything in one lightweight extension.

---

## Features

| Feature | Details |
|---|---|
| **Syntax highlighting** | Keywords, callbacks, engine classes, dot-methods, dot-properties, strings, numbers and comments (`//`, `/* */`) |
| **IntelliSense** | Completion for 23 keywords, 8 game callbacks, 32 engine classes, 40+ dot-methods and 30+ properties |
| **Diagnostics** | Missing `mend` / `end`, duplicate methods, wrong keyword casing, deprecated `print()` |
| **Snippets** | 13 templates: `emethod`, `eif`, `eife`, `eelseif`, `efor`, `etry`, `ecallback`, `eusing`, `evar`, `elog`, `enew`, `ecal`, `emode` |
| **File icons** | Custom icon theme for `.ery` and `.eryscript` files |
| **Documentation shortcut** | Open the official Erythros wiki directly from the Command Palette |

The extension is written in plain JavaScript, has no runtime dependencies and starts instantly.

---

## Quick start

1. Install the extension from the Marketplace.
2. Create a file named `MyMod.ery` (or `.eryscript`).
3. Paste the template below and press `Ctrl+Space` anywhere to explore the API.

```eryscript
using Keyneed
using UnityEngine
using EryScriptUtils
using EryScript
using System

method OnModLoadedCallback(script, mod)
    call Debug.Log("My mod loaded")
mend

method OnPlayerConnectedServerCallback(player)
    var name = call player.name
    call Debug.Log("Player connected: " + name)
mend
```

> EryScript is **case-sensitive**: keywords are always lowercase (`var`, `call`, `method`, `mend`, `end`), while engine classes and callbacks use PascalCase.

---

## Language overview

```eryscript
// A method is opened with method and closed with mend
method GiveCoins(ply, amount)
    var coins = call ply.inventory.count("Coin")
    if coins >= amount
        call ply.inventory.remove("Coin", amount)
        return true
    else
        return false
    end
mend

// for loops count from .. to
for i = 0 to 3
    call Debug.Log("index " + i)
end

// try / catch is closed with end
try
    var data = call GlobalVars.Get("save")
catch
    call Debug.Log("failed to load save")
end
```

Supported keywords: `using`, `method`, `mend`, `var`, `call`, `if`, `elseif`, `else`, `end`, `for`, `to`, `return`, `break`, `continue`, `try`, `catch`, `new`, `and`, `or`, `not`, `true`, `false`, `null`.

Supported callbacks: `OnModLoadedCallback`, `OnPlayerConnectedServerCallback`, `OnPlayerDisconnectedServerCallback`, `OnPlayerDieServerCallback`, `OnChatMessageServerCallback`, `OnPlayerCreatedCallback`, `OnPlayerRespawnedServerCallback`, `OnPlayerDamagedServerCallback`.

---

## Commands

Open the Command Palette (`Ctrl+Shift+P`) and type `EryScript`:

| Command | Description |
|---|---|
| `EryScript: Validate EryScript Document` | Runs the linter and shows a summary of errors and warnings |
| `EryScript: Open EryScript Documentation` | Opens the official Erythros wiki |

---

## Snippets

Type the prefix and press `Tab`.

| Prefix | Inserts |
|---|---|
| `emethod` | `method Name(params) … mend` |
| `eif` | `if condition … end` |
| `eife` | `if / else … end` |
| `eelseif` | `elseif condition` |
| `efor` | `for i = 0 to count - 1 … end` |
| `etry` | `try / catch … end` |
| `ecallback` | Game callback method |
| `eusing` | All five standard `using` directives |
| `evar` | `var name = null` |
| `elog` | `call Debug.Log("message")` |
| `enew` | `var name = new ObjectArrayWrapper()` |
| `ecal` | `call object.Method(args)` |
| `emode` | Complete mod template |

---

## Settings

| Setting | Default | Description |
|---|---|---|
| `eryscript.enableDiagnostics` | `true` | Enable the linter |
| `eryscript.autoApplyIconTheme` | `true` | Apply the EryScript icon theme when no icon theme is selected yet |

---

## File icons

The extension ships an icon theme called **EryScript Icon Theme**.
It is applied automatically on first activation when you have not chosen an icon theme yet.
To switch manually, run **File → Preferences → File Icon Theme** (`Ctrl+K Ctrl+T`) and pick **EryScript Icon Theme**.

---

## Diagnostics

The linter reports:

- **Missing `mend`** — a `method` block is not closed.
- **Missing `end`** — an `if`, `for`, `try` or `while` block is not closed.
- **Duplicate method** — the same method name is declared twice.
- **Wrong keyword casing** — for example `VAR`, `CALL`, `METHOD`, `MEND`.
- **Deprecated `print()`** — use `call Debug.Log("message")` instead.

Diagnostics update as you type and can be disabled with `eryscript.enableDiagnostics`.

---

## Requirements

- VS Code **1.80** or newer.
- No other extensions or runtimes are required.

---

## Installation from VSIX

If the extension is not available in the Marketplace yet:

1. Download `eryscript.vsix`.
2. Run `Extensions: Install from VSIX...` from the Command Palette.
3. Reload the window.

On Windows you can also double-click `install.bat` next to the VSIX.

---

## Troubleshooting

**Syntax highlighting is missing**
Open the file and check the language mode in the bottom-right corner. It should say *EryScript*. If not, click it and select **EryScript**.

**File icon is not shown**
Run `Ctrl+K Ctrl+T` and select **EryScript Icon Theme**. Some VS Code setups reset the icon theme after updates.

**Completion does not appear**
Press `Ctrl+Space` manually. Completion is triggered by typing, `.` or `(`.

---

## Contributing

Issues and feature requests are welcome. Please include:

- VS Code version,
- a minimal `.ery` sample that reproduces the problem,
- the exact message shown in the Problems panel.

---

## License

[MIT](LICENSE.md) © 2026 XunKal1

Erythros Lite and EryScript are created by **Keyneed**. This extension is an unofficial community tool and is not affiliated with the game developers.

---

# EryScript Language Support — Русский

Полная поддержка языка **EryScript** для VS Code — языка скриптов для модификации **Erythros Lite**.

## Возможности

| Функция | Описание |
|---|---|
| **Подсветка синтаксиса** | Ключевые слова, callbacks, классы движка, dot-методы, свойства, строки, числа, комментарии `//` и `/* */` |
| **Автодополнение** | 23 ключевых слова, 8 callbacks, 32 класса движка, 40+ методов и 30+ свойств |
| **Линтер** | Пропущенный `mend` / `end`, дубликаты методов, неверный регистр ключевых слов, устаревший `print()` |
| **Сниппеты** | 13 шаблонов: `emethod`, `eif`, `eife`, `eelseif`, `efor`, `etry`, `ecallback`, `eusing`, `evar`, `elog`, `enew`, `ecal`, `emode` |
| **Иконки файлов** | Своя тема иконок для `.ery` и `.eryscript` |
| **Быстрый доступ к вики** | Команда открытия официальной документации |

## Быстрый старт

1. Установите расширение из Marketplace.
2. Создайте файл `MyMod.ery`.
3. Вставьте шаблон из примера выше и нажмите `Ctrl+Space`.

## Команды

| Команда | Действие |
|---|---|
| `EryScript: Validate EryScript Document` | Проверить документ и показать число ошибок и предупреждений |
| `EryScript: Open EryScript Documentation` | Открыть вики Erythros |

## Сниппеты

Наберите префикс и нажмите `Tab`: `emethod`, `eif`, `eife`, `eelseif`, `efor`, `etry`, `ecallback`, `eusing`, `evar`, `elog`, `enew`, `ecal`, `emode`.

## Настройки

| Настройка | По умолчанию | Описание |
|---|---|---|
| `eryscript.enableDiagnostics` | `true` | Включить линтер |
| `eryscript.autoApplyIconTheme` | `true` | Автоматически включать тему иконок, если тема ещё не выбрана |

## Иконки файлов

Тема **EryScript Icon Theme** применяется автоматически при первом запуске, если у вас ещё не выбрана другая тема иконок.
Переключить вручную: `Ctrl+K Ctrl+T` → **EryScript Icon Theme**.

## Лицензия

[MIT](LICENSE.md) © 2026 XunKal1

Erythros Lite и EryScript созданы **Keyneed**. Расширение является неофициальным сообщественным инструментом.
