# Publishing to the Visual Studio Marketplace

This file is for maintainers only and is not included in the packaged extension.

## 1. Prerequisites

- A Microsoft account.
- A Marketplace publisher at <https://marketplace.visualstudio.com/manage>.
- The publisher ID in `package.json` must match your Marketplace publisher ID exactly.
  The current value is `xunkal1`.
- Node.js 18 or newer.

## 2. Repository

The repository and issue tracker are already configured in `package.json`:

- <https://github.com/Hinderchik/EryScript-Language-Support>
- <https://github.com/Hinderchik/EryScript-Language-Support/issues>

## 3. Get a personal access token

1. Open <https://dev.azure.com>.
2. User settings → Personal access tokens → New token.
3. Organization: **All accessible organizations**.
4. Scopes: **Marketplace → Manage**.
5. Copy the token (it is shown only once).

## 4. Log in

```
npx @vscode/vsce login xunkal1
```

Paste the token when prompted. The token is stored in the OS credential manager.

## 5. Package and check

```
npx @vscode/vsce package
npx @vscode/vsce ls
```

Install the produced `eryscript.vsix` locally and verify:

- syntax highlighting on a `.ery` file,
- completion on `Ctrl+Space`,
- diagnostics for a missing `mend`,
- snippets with `emethod` + `Tab`,
- the file icon in the Explorer.

## 6. Publish

```
npx @vscode/vsce publish
```

Or with an explicit version bump:

```
npx @vscode/vsce publish patch
npx @vscode/vsce publish minor
npx @vscode/vsce publish major
```

## 7. Update the listing

In the Marketplace management page you can edit the display name, description, categories, and upload a larger icon.
The README and CHANGELOG are taken from the packaged files automatically.

## 8. Release checklist

- [ ] `version` in `package.json` and `CHANGELOG.md` are in sync.
- [ ] `publisher` matches the Marketplace publisher ID.
- [ ] `README.md` has no broken relative links.
- [ ] `npx @vscode/vsce package` finishes without errors.
- [ ] The VSIX installs cleanly on a fresh VS Code profile.
- [ ] All commands, snippets, diagnostics and the icon theme work.
