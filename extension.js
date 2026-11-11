const vscode = require('vscode');

const LANGUAGE_ID = 'eryscript';
const ICON_THEME_ID = 'eryscript-icons';
const DOCUMENTATION_URL = 'https://wiki.keyneed.org/';

const KEYWORDS = [
    'using', 'method', 'mend', 'var', 'call', 'if', 'elseif', 'else', 'end',
    'for', 'to', 'return', 'break', 'continue', 'try', 'catch', 'new',
    'and', 'or', 'not', 'true', 'false', 'null'
];

const CALLBACKS = [
    'OnModLoadedCallback',
    'OnPlayerConnectedServerCallback',
    'OnPlayerDisconnectedServerCallback',
    'OnPlayerDieServerCallback',
    'OnChatMessageServerCallback',
    'OnPlayerCreatedCallback',
    'OnPlayerRespawnedServerCallback',
    'OnPlayerDamagedServerCallback'
];

const ENGINE_CLASSES = [
    'NetworkUserList', 'GlobalVars', 'Debug', 'MyNetwork', 'MyAsync',
    'NetworkChat', 'EryHelper', 'DialogBuilder', 'DialogPanel',
    'DialogPreferences', 'DialogComponent', 'DialogText', 'DialogButton',
    'DialogSpace', 'DialogDropdown', 'MyDropdownOption', 'ObjectArrayWrapper',
    'BytePacker', 'RpcTarget', 'EryScriptWrapper', 'DialogInput', 'Vector3',
    'Time', 'Math', 'Random', 'Int32', 'Player', 'Keyneed', 'UnityEngine',
    'EryScriptUtils', 'EryScript', 'System'
];

const NEWABLE_CLASSES = new Set([
    'ObjectArrayWrapper', 'BytePacker', 'DialogBuilder', 'DialogPanel',
    'DialogPreferences', 'DialogComponent', 'DialogText', 'DialogButton',
    'DialogSpace', 'DialogDropdown', 'MyDropdownOption', 'EryScriptWrapper',
    'DialogInput', 'Vector3'
]);

const METHOD_SIGNATURES = {
    Add: 'Add(${1:value})',
    Get: 'Get(${1:index})',
    Set: 'Set(${1:key}, ${2:value})',
    Count: 'Count()',
    WrInt: 'WrInt(${1:value})',
    StartWr: 'StartWr()',
    tryAddItem: 'tryAddItem(${1:item}, ${2:count})',
    AddItem: 'AddItem(${1:item}, ${2:count})',
    ToArray: 'ToArray()',
    Dispose: 'Dispose()',
    SpecifyTypeBySample: 'SpecifyTypeBySample(${1:sample})',
    Close: 'Close()',
    Open: 'Open(${1:true})',
    Log: 'Log(${1:message})',
    sendAlert: 'sendAlert(${1:message})',
    sendChat: 'sendChat(${1:message})',
    getModelFromPlayer: 'getModelFromPlayer(${1:player})',
    getUserFromID: 'getUserFromID(${1:id})',
    getUserFromPlayer: 'getUserFromPlayer(${1:player})',
    WaitForSeconds: 'WaitForSeconds(${1:seconds}, ${2:callback})',
    Ceiling: 'Ceiling(${1:value})',
    Range: 'Range(${1:min}, ${2:max})',
    StartsWith: 'StartsWith(${1:text})',
    Substring: 'Substring(${1:start}, ${2:length})',
    Replace: 'Replace(${1:old}, ${2:new})',
    IndexOf: 'IndexOf(${1:text})',
    LastIndexOf: 'LastIndexOf(${1:text})',
    Trim: 'Trim()',
    ToLower: 'ToLower()',
    ToString: 'ToString()',
    Parse: 'Parse(${1:text})',
    SendClothId: 'SendClothId(${1:id})',
    SendScriptToPlayer: 'SendScriptToPlayer(${1:connId}, ${2:script})',
    GetComponentByName: 'GetComponentByName(${1:name})',
    RemoveAt: 'RemoveAt(${1:index})',
    Clear: 'Clear()',
    remove: 'remove(${1:item}, ${2:count})',
    add: 'add(${1:item}, ${2:count})',
    damage: 'damage(${1:amount}, ${2:type})',
    RPC: 'RPC(${1:method}, ${2:args})'
};

const PROPERTIES = [
    'text', 'name', 'nickname', 'id', 'owner', 'Owner', 'preferences',
    'components', 'onClick', 'onValueChanged', 'closeOption', 'low', 'options',
    'inventory', 'inventoryLocal', 'model', 'clanId', 'script', 'time',
    'position', 'transform', 'IsMasterClient', 'length', 'count', 'x', 'y',
    'z', 'defaultValue', 'lifeLocal', 'LocalPlayer', 'All', 'Server'
];

let diagnosticTimer = null;
let suggestDebounce = null;
let suggestRequested = false;
let widgetListener = null;

function activate(context) {
    applyIconThemeAuto();

    context.subscriptions.push(
        vscode.commands.registerCommand('eryscript.validateDocument', validateActiveDocument),
        vscode.commands.registerCommand('eryscript.showDocumentation', () => {
            vscode.env.openExternal(vscode.Uri.parse(DOCUMENTATION_URL));
        })
    );

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { language: LANGUAGE_ID },
            createCompletionProvider(),
            '.', '(', '"'
        )
    );

    const diagnostics = vscode.languages.createDiagnosticCollection(LANGUAGE_ID);
    context.subscriptions.push(diagnostics);

    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, diagnostics);
    }

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            refreshDiagnostics(document, diagnostics);
            if (document.languageId === LANGUAGE_ID && vscode.window.activeTextEditor?.document === document) {
                showSuggestions();
            }
        }),
        vscode.workspace.onDidChangeTextDocument(event => {
            scheduleDiagnostics(event.document, diagnostics);
            if (event.document.languageId === LANGUAGE_ID) {
                debounceSuggest();
            }
        }),
        vscode.workspace.onDidCloseTextDocument(document => {
            diagnostics.delete(document.uri);
        }),
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) refreshDiagnostics(editor.document, diagnostics);
            if (editor && editor.document.languageId === LANGUAGE_ID) {
                showSuggestions();
            } else {
                hideWidgetIfVisible();
            }
        }),
        vscode.commands.registerCommand('_eryscript.hideSuggest', () => {
            suggestRequested = false;
        })
    );
}

function applyIconThemeAuto() {
    try {
        const enabled = vscode.workspace
            .getConfiguration('eryscript')
            .get('autoApplyIconTheme', true);
        if (!enabled) return;
        const workbench = vscode.workspace.getConfiguration('workbench');
        if (!workbench.get('iconTheme')) {
            workbench.update('iconTheme', ICON_THEME_ID, vscode.ConfigurationTarget.Global);
        }
    } catch (error) {
        return;
    }
}

function createCompletionProvider() {
    return {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.slice(0, position.character);
            const range = new vscode.Range(
                position.translate(0, -wordLength(linePrefix)), position
            );
            const items = [];

            for (const keyword of KEYWORDS) {
                items.push(completion(keyword, vscode.CompletionItemKind.Keyword, range, keyword));
            }
            for (const callback of CALLBACKS) {
                const item = completion(callback, vscode.CompletionItemKind.Function, range,
                    callback + '(${1:params})');
                item.documentation = new vscode.MarkdownString('Game callback. Declare it inside a `method` block and close it with `mend`.');
                items.push(item);
            }
            for (const className of ENGINE_CLASSES) {
                const item = completion(className, vscode.CompletionItemKind.Class, range,
                    NEWABLE_CLASSES.has(className) ? `new ${className}()` : className);
                item.documentation = new vscode.MarkdownString('EryScript engine class.');
                items.push(item);
            }
            for (const [method, signature] of Object.entries(METHOD_SIGNATURES)) {
                const item = completion(method, vscode.CompletionItemKind.Method, range, signature);
                item.documentation = new vscode.MarkdownString('Built-in dot method.');
                items.push(item);
            }
            for (const property of PROPERTIES) {
                const item = completion(property, vscode.CompletionItemKind.Property, range, property);
                item.documentation = new vscode.MarkdownString('Engine property.');
                items.push(item);
            }

            return items;
        }
    };
}

function completion(label, kind, range, insertText) {
    const item = new vscode.CompletionItem(label, kind);
    item.range = range;
    item.insertText = new vscode.SnippetString(insertText);
    if (insertText === label) {
        item.insertText = label;
    }
    return item;
}

function wordLength(text) {
    const match = text.match(/[A-Za-z0-9_]*$/);
    return match ? match[0].length : 0;
}

function showSuggestions() {
    if (!vscode.window.activeTextEditor || vscode.window.activeTextEditor.document.languageId !== LANGUAGE_ID) {
        return;
    }
    suggestRequested = true;
    vscode.commands.executeCommand('editor.action.triggerSuggest');
    ensureVisibilityListener();
}

function ensureVisibilityListener() {
    if (widgetListener) return;
    widgetListener = vscode.commands.registerCommand('_eryscript.hideSuggest', () => {
        suggestRequested = false;
        widgetListener.dispose();
        widgetListener = null;
    });
}

function hideWidgetIfVisible() {
    if (widgetListener) {
        widgetListener.dispose();
        widgetListener = null;
    }
    suggestRequested = false;
}

function debounceSuggest() {
    if (!suggestRequested) return;
    if (suggestDebounce) clearTimeout(suggestDebounce);
    suggestDebounce = setTimeout(() => {
        vscode.commands.executeCommand('editor.action.triggerSuggest');
    }, 250);
}

function scheduleDiagnostics(document, collection) {
    if (document.languageId !== LANGUAGE_ID) return;
    if (diagnosticTimer) clearTimeout(diagnosticTimer);
    diagnosticTimer = setTimeout(() => refreshDiagnostics(document, collection), 300);
}

function refreshDiagnostics(document, collection) {
    if (document.languageId !== LANGUAGE_ID) return;
    const enabled = vscode.workspace
        .getConfiguration('eryscript')
        .get('enableDiagnostics', true);
    if (!enabled) {
        collection.delete(document.uri);
        return;
    }
    collection.set(document.uri, collectDiagnostics(document));
}

function collectDiagnostics(document) {
    const diagnostics = [];
    const methods = [];
    const blockOpeners = [];
    let mendCount = 0;
    let endCount = 0;
    let lastLine = document.lineCount - 1;

    for (let line = 0; line <= lastLine; line++) {
        const text = document.lineAt(line).text;
        const trimmed = text.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
            continue;
        }

        const methodMatch = trimmed.match(/^method\s+([A-Za-z_][A-Za-z0-9_]*)/);
        if (methodMatch) {
            methods.push({ name: methodMatch[1], line: line });
        }
        if (/^mend\b/.test(trimmed)) mendCount++;
        if (/^(if|for|try|while)\b/.test(trimmed)) blockOpeners.push(line);
        if (/^end\b/.test(trimmed)) endCount++;

        const upper = trimmed.match(/^(VAR|CALL|METHOD|MEND|IF|ELSEIF|ELSE|END|FOR|TO|RETURN|BREAK|CONTINUE|TRY|CATCH|USING|NEW|AND|OR|NOT)\b/);
        if (upper) {
            diagnostics.push(makeDiagnostic(
                document, line, text.indexOf(upper[1]), upper[1].length,
                `EryScript is case-sensitive: write "${upper[1].toLowerCase()}" instead of "${upper[1]}".`,
                vscode.DiagnosticSeverity.Warning
            ));
        }

        const printMatch = text.match(/\bprint\s*\(/);
        if (printMatch) {
            diagnostics.push(makeDiagnostic(
                document, line, printMatch.index, printMatch[0].length,
                'print() is deprecated. Use call Debug.Log("message").',
                vscode.DiagnosticSeverity.Warning
            ));
        }
    }

    if (methods.length > mendCount) {
        const missing = methods.length - mendCount;
        diagnostics.push(makeDiagnostic(
            document, lastLine, 0, document.lineAt(lastLine).text.length,
            `Missing ${missing} mend: ${methods.length} method(s) but only ${mendCount} mend.`,
            vscode.DiagnosticSeverity.Error
        ));
    } else if (mendCount > methods.length) {
        diagnostics.push(makeDiagnostic(
            document, lastLine, 0, document.lineAt(lastLine).text.length,
            `Extra mend: ${mendCount} mend for ${methods.length} method(s).`,
            vscode.DiagnosticSeverity.Error
        ));
    }

    if (blockOpeners.length > endCount) {
        const missing = blockOpeners.length - endCount;
        const line = blockOpeners[blockOpeners.length - 1];
        diagnostics.push(makeDiagnostic(
            document, line, 0, document.lineAt(line).text.length,
            `Missing ${missing} end: ${blockOpeners.length} block(s) but only ${endCount} end.`,
            vscode.DiagnosticSeverity.Error
        ));
    } else if (endCount > blockOpeners.length) {
        diagnostics.push(makeDiagnostic(
            document, lastLine, 0, document.lineAt(lastLine).text.length,
            `Extra end: ${endCount} end for ${blockOpeners.length} block(s).`,
            vscode.DiagnosticSeverity.Error
        ));
    }

    const seen = new Map();
    for (const method of methods) {
        if (seen.has(method.name)) {
            diagnostics.push(makeDiagnostic(
                document, method.line, 0, document.lineAt(method.line).text.length,
                `Duplicate method "${method.name}". A method with this name already exists on line ${seen.get(method.name) + 1}.`,
                vscode.DiagnosticSeverity.Warning
            ));
        } else {
            seen.set(method.name, method.line);
        }
    }

    return diagnostics;
}

function makeDiagnostic(document, line, start, length, message, severity) {
    const safeLine = Math.min(line, document.lineCount - 1);
    const text = document.lineAt(safeLine).text;
    const safeStart = Math.max(0, Math.min(start, text.length));
    const safeLength = Math.max(1, Math.min(length || 1, text.length - safeStart));
    const range = new vscode.Range(safeLine, safeStart, safeLine, safeStart + safeLength);
    const diagnostic = new vscode.Diagnostic(range, message, severity);
    diagnostic.source = 'EryScript';
    return diagnostic;
}

function validateActiveDocument() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== LANGUAGE_ID) {
        vscode.window.showInformationMessage('Open an EryScript file (.ery or .eryscript) to validate it.');
        return;
    }
    const diagnostics = collectDiagnostics(editor.document);
    const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
    const warnings = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
    vscode.window.showInformationMessage(
        `EryScript validation: ${errors} error(s), ${warnings} warning(s).`
    );
}

function deactivate() {
    if (diagnosticTimer) clearTimeout(diagnosticTimer);
    if (suggestDebounce) clearTimeout(suggestDebounce);
}

module.exports = { activate, deactivate };
