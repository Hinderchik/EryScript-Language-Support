# EryScript Language

[MIT License](LICENSE.md) · v2.0.5 · VS Code ≥ 1.80

Full language support for **EryScript**, the scripting language used to mod **Erythros Lite**.
Syntax highlighting, IntelliSense, diagnostics, snippets and custom file icons — all in one lightweight extension.

---

## Install

Install directly from the VS Code extension view (`Ctrl+Shift+X`) by searching for **EryScript** published by **xunkal1**, or visit the [Marketplace page](https://marketplace.visualstudio.com/items?itemName=XunKal1.eryscript).

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
2. Create a file named `MyMod.ery`.
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

method OnPlayerConnectedServerCallback(connId)
    var view = call NetworkUserList.getModelFromPlayer(connId)
    if view != null
        var ownerId = call view.Owner
        call Debug.Log("Player connected: " + ownerId)
    end
mend
```

> EryScript is **case-sensitive**: keywords are always lowercase (`var`, `call`, `method`, `mend`, `end`), while engine classes and callbacks use PascalCase.

---

## Language overview

```eryscript
// A method is opened with `method` and closed with `mend`
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

## Example mod

A complete, ready-to-paste mod ships with the extension: [`examples/infinite_stamina.ery`](examples/infinite_stamina.ery).

It starts a half-second loop and, for every tracked player:

- heals the player with `call life.damage(-amount, "heal")` so health never drops to zero;
- reads `life.stamina` and sets it back to `staminaTarget` (100) as soon as it drops below `staminaThreshold` (50 by default);
- updates both `view.life` and `view.lifeLocal`, so the stamina bar of the local player stays full.

`Keyneed.Life` exposes stamina as the `stamina` property (`get_stamina` / `set_stamina`). There is no `SetStamina()` method, so the example never calls one.

Type `/stamina` in chat to print how many players the loop is serving, how many refills were made and the current stamina value.

```eryscript
method RefillLife(life)
    if life == null
        return null
    end
    if life.health > 0
        call life.damage(-healAmount, "heal")
    end
    var current = life.stamina
    if current < staminaThreshold
        life.stamina = staminaTarget
        call CountRefill()
    end
mend
```

Copy the file to your mod folder, or open it in VS Code to try highlighting, IntelliSense and diagnostics on real code.

---

## Commands

Open the Command Palette (`Ctrl+Shift+P`) and type `EryScript`:

| Command | Description |
|---|---|
| `EryScript: Validate EryScript Document` | Runs the linter and shows a summary of errors and warnings |
| `EryScript: Open EryScript Documentation` | Opens the official Erythros wiki |

---

## Snippets

Type the prefix and press `Tab`:

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
| `eryscript.autoComplete` | `true` | Show the IntelliSense popup automatically while typing in `.ery` files |

To switch the icon theme manually run **File → Preferences → File Icon Theme** (`Ctrl+K Ctrl+T`) and pick **EryScript Icon Theme**.

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

## Troubleshooting

**Syntax highlighting is missing**
Open the file and check the language mode in the bottom-right corner. It should say *EryScript*. If not, click it and select **EryScript**.

**File icon is not shown**
Run `Ctrl+K Ctrl+T` and select **EryScript Icon Theme**. Some VS Code setups reset the icon theme after updates.

**Completion does not appear**
Press `Ctrl+Space` manually. Completion is triggered by typing, `.` or `(`.

---

## Contributing

Issues and feature requests are welcome at <https://github.com/Hinderchik/EryScript-Language-Support/issues>.
Please include your VS Code version, a minimal `.ery` sample that reproduces the problem and the exact message from the Problems panel.

---

## License

[MIT](LICENSE.md) © 2026 XunKal1

Erythros Lite and EryScript are created by **Keyneed**. This extension is an unofficial community tool and is not affiliated with the game developers.

---

# Поддержка EryScript для VS Code

Полная поддержка языка **EryScript** — языка скриптов для модификации **Erythros Lite** от **Keyneed**.

Подсветка синтаксиса, автодополнение, линтер, сниппеты и иконки файлов в одном расширении.

## Установка

Установите расширение из внутреннего магазина VS Code (`Ctrl+Shift+X`) по запросу **EryScript** (издатель **xunkal1**) или откройте [страницу на Marketplace](https://marketplace.visualstudio.com/items?itemName=XunKal1.eryscript).

## Возможности

| Функция | Описание |
|---|---|
| **Подсветка синтаксиса** | Ключевые слова, callbacks, классы движка, dot-методы, свойства, строки, числа, комментарии `//` и `/* */` |
| **Автодополнение** | 23 ключевых слова, 8 callbacks, 32 класса движка, 40+ методов и 30+ свойств |
| **Линтер** | Пропущенный `mend` / `end`, дубликаты методов, неверный регистр ключевых слов, устаревший `print()` |
| **Сниппеты** | 13 шаблонов: `emethod`, `eif`, `eife`, `eelseif`, `efor`, `etry`, `ecallback`, `eusing`, `evar`, `elog`, `enew`, `ecal`, `emode` |
| **Иконки файлов** | Своя тема иконок для `.ery` и `.eryscript` |
| **Быстрый доступ к вики** | Команда открытия официальной документации Erythros |

## Быстрый старт

1. Установите расширение из Marketplace.
2. Создайте файл `MyMod.ery`.
3. Вставьте шаблон выше и нажмите `Ctrl+Space`.

## Пример мода

Готовый пример лежит в [`examples/infinite_stamina.ery`](examples/infinite_stamina.ery): цикл раз в полсекунды лечит игроков через `life.damage(-amount, "heal")` и восстанавливает стамину, как только она опускается ниже порога `staminaThreshold` (по умолчанию 50), выставляя `life.stamina` в `staminaTarget` (100). В `Keyneed.Life` стамина — это свойство `stamina` (`get_stamina` / `set_stamina`), метода `SetStamina()` не существует. Обновляются и `view.life`, и `view.lifeLocal`, поэтому полоса стамины локального игрока остаётся заполненной. Команда `/stamina` в чате показывает число отслеживаемых игроков, количество восстановлений и текущую стамину.

## Команды

Откройте Палитру команд (`Ctrl+Shift+P`) и введите `EryScript`:

| Команда | Действие |
|---|---|
| `EryScript: Validate EryScript Document` | Проверить документ и показать число ошибок и предупреждений |
| `EryScript: Open EryScript Documentation` | Открыть вики Erythros |

## Настройки

| Настройка | По умолчанию | Описание |
|---|---|---|
| `eryscript.enableDiagnostics` | `true` | Включить линтер |
| `eryscript.autoApplyIconTheme` | `true` | Автоматически включать тему иконок, если тема ещё не выбрана |
| `eryscript.autoComplete` | `true` | Автоматически показывать окно автодополнения при наборе кода в `.ery` |

## Лицензия

[MIT](LICENSE.md) © 2026 XunKal1

Erythros Lite и EryScript созданы **Keyneed**. Расширение является неофициальным сообщественным инструментом.
