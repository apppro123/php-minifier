import * as vscode from "vscode";
import { config, reloadConfig } from "./config";
import { minifyDocument } from "./minify-document";
import { statusBar } from "./status-bar";
import { EXT_ID, onConfigFileChange, getOutPath, isMinified } from "./utils";
import { File } from "./fs";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  // Load config
  reloadConfig();

  // Show minify button
  if (config.hideButton !== "never") {
    statusBar.showButton();
  }

  let disposable = vscode.commands.registerCommand(
    "php-minifier.minify_php",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No document open.");
        return;
      }

      if (editor.document.isUntitled) {
        vscode.window.showErrorMessage(
          "File must be saved before it can be minified."
        );
        return;
      }
      minifyDocument(editor.document);
    }
  );

  context.subscriptions.push(
    disposable,
    // Reload minify config if the vscode config is modified
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(EXT_ID)) {
        reloadConfig();
        if (config.hideButton === "never") {
          statusBar.showButton();
        } else if (config.hideButton === "always") {
          statusBar.hideButton();
        }
        vscode.window.showInformationMessage("Minify configuration reloaded.");
      }
    }),
    vscode.workspace.onDidOpenTextDocument(() => {
      if (
        vscode.window.activeTextEditor &&
        (config.hideButton === "auto" || config.hideButton === true)
      ) {
        const doc = vscode.window.activeTextEditor.document;
        if (doc.languageId === "php" && !isMinified(doc)) {
          statusBar.showButton();
        } else {
          statusBar.hideButton();
        }
      }
    }),
    // Minify on save.
    vscode.workspace.onDidSaveTextDocument((doc) => {
      if (
        config.minifyOnSave === false ||
        config.minifyOnSave === "no" ||
        doc.languageId !== "php"
      ) {
        return;
      }

      if (config.minifyOnSave === "exists") {
        if (!new File(getOutPath(doc)).exists()) {
          return;
        }
      }

      minifyDocument(doc);
    })
  );

  const watcher = vscode.workspace.createFileSystemWatcher(
    "**",
    false,
    false,
    false
  );
  watcher.onDidCreate(onConfigFileChange);
  watcher.onDidChange(onConfigFileChange);
  watcher.onDidDelete(onConfigFileChange);

  context.subscriptions.push(watcher);
}

// this method is called when your extension is deactivated
export function deactivate() {}
