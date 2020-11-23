// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { minifyDocument } from "./minify-document";
import { statusBar } from "./status-bar";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  statusBar.showButton();

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

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
