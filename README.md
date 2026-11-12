# EryScript Language

[MIT License](LICENSE.md) В· v2.0.10 В· VS Code в‰Ґ 1.80

Full language support for **EryScript**, the scripting language used to mod **Erythros Lite**.
Syntax highlighting, IntelliSense, diagnostics, snippets and custom file icons вЂ” all in one lightweight extension.

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

It starts a 0.2-second loop and, for every tracked player, calls `call life.exhaust(-200)` on each tick so the internal stamina buffer stays well above the display cap вЂ” keeping the HUD bar full regardless of natural drain. It also heals with `call life.damage(-amount, "heal")`.

The host is tracked through `MyNetwork.LocalPlayer`, every other player through `OnPlayerConnectedServerCallback(connId)`.

Stamina is readable through the `stamina` property, but the only writable path is `Life.exhaust()`. Calling it with a negative amount adds stamina, and unlike the property setter it also refreshes the HUD. `realStamina` and `energyBuffer` reject writes, and there is no `SetStamina()` method.

Type `/stamina` in chat to print how many players the loop is serving, how many refills were made and the current stamina value.

```eryscript
method RefillLife(life)
    if life == null
        return null
    end
    call life.exhaust(-200)
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
| `emethod` | `method Name(params) вЂ¦ mend` |
| `eif` | `if condition вЂ¦ end` |
| `eife` | `if / else вЂ¦ end` |
| `eelseif` | `elseif condition` |
| `efor` | `for i = 0 to count - 1 вЂ¦ end` |
| `etry` | `try / catch вЂ¦ end` |
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

To switch the icon theme manually run **File в†’ Preferences в†’ File Icon Theme** (`Ctrl+K Ctrl+T`) and pick **EryScript Icon Theme**.

---

## Diagnostics

The linter reports:

- **Missing `mend`** вЂ” a `method` block is not closed.
- **Missing `end`** вЂ” an `if`, `for`, `try` or `while` block is not closed.
- **Duplicate method** вЂ” the same method name is declared twice.
- **Wrong keyword casing** вЂ” for example `VAR`, `CALL`, `METHOD`, `MEND`.
- **Deprecated `print()`** вЂ” use `call Debug.Log("message")` instead.

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

[MIT](LICENSE.md) В© 2026 XunKal1

Erythros Lite and EryScript are created by **Keyneed**. This extension is an unofficial community tool and is not affiliated with the game developers.

---

# РџРѕРґРґРµСЂР¶РєР° EryScript РґР»СЏ VS Code

РџРѕР»РЅР°СЏ РїРѕРґРґРµСЂР¶РєР° СЏР·С‹РєР° **EryScript** вЂ” СЏР·С‹РєР° СЃРєСЂРёРїС‚РѕРІ РґР»СЏ РјРѕРґРёС„РёРєР°С†РёРё **Erythros Lite** РѕС‚ **Keyneed**.

РџРѕРґСЃРІРµС‚РєР° СЃРёРЅС‚Р°РєСЃРёСЃР°, Р°РІС‚РѕРґРѕРїРѕР»РЅРµРЅРёРµ, Р»РёРЅС‚РµСЂ, СЃРЅРёРїРїРµС‚С‹ Рё РёРєРѕРЅРєРё С„Р°Р№Р»РѕРІ РІ РѕРґРЅРѕРј СЂР°СЃС€РёСЂРµРЅРёРё.

## РЈСЃС‚Р°РЅРѕРІРєР°

РЈСЃС‚Р°РЅРѕРІРёС‚Рµ СЂР°СЃС€РёСЂРµРЅРёРµ РёР· РІРЅСѓС‚СЂРµРЅРЅРµРіРѕ РјР°РіР°Р·РёРЅР° VS Code (`Ctrl+Shift+X`) РїРѕ Р·Р°РїСЂРѕСЃСѓ **EryScript** (РёР·РґР°С‚РµР»СЊ **xunkal1**) РёР»Рё РѕС‚РєСЂРѕР№С‚Рµ [СЃС‚СЂР°РЅРёС†Сѓ РЅР° Marketplace](https://marketplace.visualstudio.com/items?itemName=XunKal1.eryscript).

## Р’РѕР·РјРѕР¶РЅРѕСЃС‚Рё

| Р¤СѓРЅРєС†РёСЏ | РћРїРёСЃР°РЅРёРµ |
|---|---|
| **РџРѕРґСЃРІРµС‚РєР° СЃРёРЅС‚Р°РєСЃРёСЃР°** | РљР»СЋС‡РµРІС‹Рµ СЃР»РѕРІР°, callbacks, РєР»Р°СЃСЃС‹ РґРІРёР¶РєР°, dot-РјРµС‚РѕРґС‹, СЃРІРѕР№СЃС‚РІР°, СЃС‚СЂРѕРєРё, С‡РёСЃР»Р°, РєРѕРјРјРµРЅС‚Р°СЂРёРё `//` Рё `/* */` |
| **РђРІС‚РѕРґРѕРїРѕР»РЅРµРЅРёРµ** | 23 РєР»СЋС‡РµРІС‹С… СЃР»РѕРІР°, 8 callbacks, 32 РєР»Р°СЃСЃР° РґРІРёР¶РєР°, 40+ РјРµС‚РѕРґРѕРІ Рё 30+ СЃРІРѕР№СЃС‚РІ |
| **Р›РёРЅС‚РµСЂ** | РџСЂРѕРїСѓС‰РµРЅРЅС‹Р№ `mend` / `end`, РґСѓР±Р»РёРєР°С‚С‹ РјРµС‚РѕРґРѕРІ, РЅРµРІРµСЂРЅС‹Р№ СЂРµРіРёСЃС‚СЂ РєР»СЋС‡РµРІС‹С… СЃР»РѕРІ, СѓСЃС‚Р°СЂРµРІС€РёР№ `print()` |
| **РЎРЅРёРїРїРµС‚С‹** | 13 С€Р°Р±Р»РѕРЅРѕРІ: `emethod`, `eif`, `eife`, `eelseif`, `efor`, `etry`, `ecallback`, `eusing`, `evar`, `elog`, `enew`, `ecal`, `emode` |
| **РРєРѕРЅРєРё С„Р°Р№Р»РѕРІ** | РЎРІРѕСЏ С‚РµРјР° РёРєРѕРЅРѕРє РґР»СЏ `.ery` Рё `.eryscript` |
| **Р‘С‹СЃС‚СЂС‹Р№ РґРѕСЃС‚СѓРї Рє РІРёРєРё** | РљРѕРјР°РЅРґР° РѕС‚РєСЂС‹С‚РёСЏ РѕС„РёС†РёР°Р»СЊРЅРѕР№ РґРѕРєСѓРјРµРЅС‚Р°С†РёРё Erythros |

## Р‘С‹СЃС‚СЂС‹Р№ СЃС‚Р°СЂС‚

1. РЈСЃС‚Р°РЅРѕРІРёС‚Рµ СЂР°СЃС€РёСЂРµРЅРёРµ РёР· Marketplace.
2. РЎРѕР·РґР°Р№С‚Рµ С„Р°Р№Р» `MyMod.ery`.
3. Р’СЃС‚Р°РІСЊС‚Рµ С€Р°Р±Р»РѕРЅ РІС‹С€Рµ Рё РЅР°Р¶РјРёС‚Рµ `Ctrl+Space`.

## РџСЂРёРјРµСЂ РјРѕРґР°

Р“РѕС‚РѕРІС‹Р№ РїСЂРёРјРµСЂ Р»РµР¶РёС‚ РІ [`examples/infinite_stamina.ery`](examples/infinite_stamina.ery): С†РёРєР» СЂР°Р· РІ 0.2 СЃ Р»РµС‡РёС‚ РёРіСЂРѕРєРѕРІ С‡РµСЂРµР· `life.damage(-amount, "heal")` Рё РєР°Р¶РґС‹Рµ С‚РёРє РІС‹Р·С‹РІР°РµС‚ `call life.exhaust(-200)`, С‡С‚РѕР±С‹ РІРЅСѓС‚СЂРµРЅРЅСЏСЏ Р±СѓС„РµСЂРЅР°СЏ СЃС‚Р°РјРЅРёРЅР° РІСЃРµРіРґР° Р±С‹Р»Р° РІС‹С€Рµ РїРѕС‚РѕР»РєР° РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ вЂ” С‚РѕРіРґР° РїРѕР»РѕСЃРєР° РёРЅС‚РµСЂС„РµР№СЃР° РЅРµ РїСѓСЃС‚РµРµС‚. РЎС‚Р°РјРёРЅСѓ РјРѕР¶РЅРѕ С‡РёС‚Р°С‚СЊ С‡РµСЂРµР· СЃРІРѕР№СЃС‚РІРѕ `stamina`, РЅРѕ РµРґРёРЅСЃС‚РІРµРЅРЅС‹Р№ СЂР°Р±РѕС‡РёР№ РїСѓС‚СЊ Р·Р°РїРёСЃРё вЂ” `Life.exhaust()`: РѕС‚СЂРёС†Р°С‚РµР»СЊРЅРѕРµ Р·РЅР°С‡РµРЅРёРµ РґРѕР±Р°РІР»СЏРµС‚ СЃС‚Р°РјРёРЅСѓ Рё РѕР±РЅРѕРІР»СЏРµС‚ РїРѕР»РѕСЃРєСѓ РІ РёРЅС‚РµСЂС„РµР№СЃРµ (РѕР±С‹С‡РЅРѕРµ РїСЂРёСЃРІР°РёРІР°РЅРёРµ `stamina = 100` РјРµРЅСЏРµС‚ Р·РЅР°С‡РµРЅРёРµ, РЅРѕ HUD РµРіРѕ РёРіРЅРѕСЂРёСЂСѓРµС‚, Р° `realStamina` Рё `energyBuffer` РІРѕРѕР±С‰Рµ С‚РѕР»СЊРєРѕ РґР»СЏ С‡С‚РµРЅРёСЏ). РњРµС‚РѕРґР° `SetStamina()` РЅРµ СЃСѓС‰РµСЃС‚РІСѓРµС‚. РњРѕРґРµР»СЊ РёРіСЂРѕРєР° Р±РµСЂС‘С‚СЃСЏ С‡РµСЂРµР· `NetworkUserList.getModelFromPlayer(connId)`, СЂР°Р±РѕС‚Р° РёРґС‘С‚ СЃ РєРѕРјРїРѕРЅРµРЅС‚РѕРј `lifeLocal` (СЃ Р·Р°РїР°СЃРЅС‹Рј РІР°СЂРёР°РЅС‚РѕРј `life`), РїРѕСЌС‚РѕРјСѓ РїРѕР»РѕСЃР° СЃС‚Р°РјРёРЅС‹ Р»РѕРєР°Р»СЊРЅРѕРіРѕ РёРіСЂРѕРєР° РѕСЃС‚Р°С‘С‚СЃСЏ Р·Р°РїРѕР»РЅРµРЅРЅРѕР№. РҐРѕСЃС‚ РѕС‚СЃР»РµР¶РёРІР°РµС‚СЃСЏ С‡РµСЂРµР· `MyNetwork.LocalPlayer`, РѕСЃС‚Р°Р»СЊРЅС‹Рµ РёРіСЂРѕРєРё вЂ” С‡РµСЂРµР· `OnPlayerConnectedServerCallback(connId)`. РљРѕРјР°РЅРґР° `/stamina` РІ С‡Р°С‚Рµ РїРѕРєР°Р·С‹РІР°РµС‚ С‡РёСЃР»Рѕ РѕС‚СЃР»РµР¶РёРІР°РµРјС‹С… РёРіСЂРѕРєРѕРІ, РєРѕР»РёС‡РµСЃС‚РІРѕ РІРѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёР№ Рё С‚РµРєСѓС‰СѓСЋ СЃС‚Р°РјРёРЅСѓ.

## РљРѕРјР°РЅРґС‹

РћС‚РєСЂРѕР№С‚Рµ РџР°Р»РёС‚СЂСѓ РєРѕРјР°РЅРґ (`Ctrl+Shift+P`) Рё РІРІРµРґРёС‚Рµ `EryScript`:

| РљРѕРјР°РЅРґР° | Р”РµР№СЃС‚РІРёРµ |
|---|---|
| `EryScript: Validate EryScript Document` | РџСЂРѕРІРµСЂРёС‚СЊ РґРѕРєСѓРјРµРЅС‚ Рё РїРѕРєР°Р·Р°С‚СЊ С‡РёСЃР»Рѕ РѕС€РёР±РѕРє Рё РїСЂРµРґСѓРїСЂРµР¶РґРµРЅРёР№ |
| `EryScript: Open EryScript Documentation` | РћС‚РєСЂС‹С‚СЊ РІРёРєРё Erythros |

## РќР°СЃС‚СЂРѕР№РєРё

| РќР°СЃС‚СЂРѕР№РєР° | РџРѕ СѓРјРѕР»С‡Р°РЅРёСЋ | РћРїРёСЃР°РЅРёРµ |
|---|---|---|
| `eryscript.enableDiagnostics` | `true` | Р’РєР»СЋС‡РёС‚СЊ Р»РёРЅС‚РµСЂ |
| `eryscript.autoApplyIconTheme` | `true` | РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРё РІРєР»СЋС‡Р°С‚СЊ С‚РµРјСѓ РёРєРѕРЅРѕРє, РµСЃР»Рё С‚РµРјР° РµС‰С‘ РЅРµ РІС‹Р±СЂР°РЅР° |
| `eryscript.autoComplete` | `true` | РђРІС‚РѕРјР°С‚РёС‡РµСЃРєРё РїРѕРєР°Р·С‹РІР°С‚СЊ РѕРєРЅРѕ Р°РІС‚РѕРґРѕРїРѕР»РЅРµРЅРёСЏ РїСЂРё РЅР°Р±РѕСЂРµ РєРѕРґР° РІ `.ery` |

## Р›РёС†РµРЅР·РёСЏ

[MIT](LICENSE.md) В© 2026 XunKal1

Erythros Lite Рё EryScript СЃРѕР·РґР°РЅС‹ **Keyneed**. Р Р°СЃС€РёСЂРµРЅРёРµ СЏРІР»СЏРµС‚СЃСЏ РЅРµРѕС„РёС†РёР°Р»СЊРЅС‹Рј СЃРѕРѕР±С‰РµСЃС‚РІРµРЅРЅС‹Рј РёРЅСЃС‚СЂСѓРјРµРЅС‚РѕРј.

