"use strict";

import * as vscode from "vscode";

import toSpecPath from "./utils/toSpecPath";

interface IOptions {
  path?: string;
  lineNumber?: number;
  commandText?: string;
}

let lastCommandText: string;
let activeTerminals: {[index: string]: vscode.Terminal} = {};

const SPEC_TERMINAL_NAME = "Running Specs";

vscode.window.onDidCloseTerminal((terminal: vscode.Terminal) => {
  if (activeTerminals[terminal.name]) {
    delete activeTerminals[terminal.name];
  }
});

export function runSpecFile(options: IOptions): void {
  let editor: vscode.TextEditor = vscode.window.activeTextEditor,
    path = vscode.workspace.asRelativePath(options.path || editor.document.fileName, false),
    pattern = "spec",
    fileName = toSpecPath(path, pattern);

  if (!editor || (!isSpecDirectory(fileName, pattern) && !isSpec(fileName, pattern) && !options.commandText)) {
    return;
  }

  if (vscode.workspace.getConfiguration("crystal").get("specSaveFile")) {
    vscode.window.activeTextEditor.document.save();
  }
  executeInTerminal(fileName, options);
}

export function runLastSpec(): void {
  if (lastCommandText) {
    runSpecFile({commandText: lastCommandText});
  }
}

function executeInTerminal(fileName: string, options: IOptions): void {
  const specTerminal = getOrCreateTerminal(SPEC_TERMINAL_NAME);
  const execute = () => executeCommand(specTerminal, fileName, options);

  if (shouldClearTerminal()) {
    vscode.commands.executeCommand("workbench.action.terminal.clear").then(execute);
  } else {
    execute();
  }
}

function executeCommand(specTerminal: vscode.Terminal, fileName: string, options: IOptions): void {
  specTerminal.show(shouldPreserveFocus());

  let lineNumberText = options.lineNumber ? `:${options.lineNumber}` : "",
    commandText = options.commandText || `${getSpecCommand()} ${fileName}${lineNumberText}`;

  specTerminal.sendText(commandText);

  lastCommandText = commandText;
}

function getTerminalName(prefix: string): string {
  return [prefix, vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri).name].join(" ");
}

function getOrCreateTerminal(prefix: string): vscode.Terminal {
  const terminalName = getTerminalName(prefix);

  if (activeTerminals[terminalName]) {
    return activeTerminals[terminalName];
  } else {
    const terminal = vscode.window.createTerminal(terminalName);
    activeTerminals[terminalName] = terminal;
    return terminal;
  }
}

function getSpecCommand(): unknown {
  if (customSpecCommand()) {
    return customSpecCommand();
  } else {
    return "crystal spec";
  }
}

function shouldPreserveFocus(): boolean {
  return !vscode.workspace.getConfiguration("crystal").get("specFocusTerminal");
}

function shouldClearTerminal(): unknown {
  return vscode.workspace.getConfiguration("crystal").get("specClearTerminal");
}

function customSpecCommand(): unknown {
  return vscode.workspace.getConfiguration("crystal").get("specCommand");
}

function isSpec(fileName: string, pattern: string): boolean {
  return fileName.indexOf(`_${pattern}.cr`) > -1;
}

function isSpecDirectory(fileName: string, pattern: string): boolean {
  return fileName.indexOf(pattern) > -1 && fileName.indexOf(".cr") == -1;
}
