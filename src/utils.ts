import * as vscode from "vscode";
import * as path from "path";
import { config, reloadConfig } from './config';

export const EXT_ID = 'php-minifier';

export function isMinified(doc: vscode.TextDocument): boolean {
  const baseName = path.basename(doc.fileName);
  const postfix = baseName.split(".")[baseName.split(".").length - 2];
  //return if its a php file and if it has "min" in its name after the point
  return doc.languageId === "php" && postfix === "min";
}

export function getOutPath(doc: vscode.TextDocument): string {
  const file = {
    basename: path.basename(doc.uri.fsPath),
    extname: path.extname(doc.uri.fsPath),
    dirname: path.dirname(doc.uri.fsPath),
    languageId: doc.languageId,
  };

  let outNameParts = file.basename.split(".");

  outNameParts.pop();

  if (file.languageId === "php") {
    outNameParts.push("min");
  }

  outNameParts.push(file.extname.replace(".", ""));
  const baseOut = outNameParts.join(".");

  let outPath: string;

  if (file.languageId === "php") {
    if (vscode.workspace.workspaceFolders) {
      outPath = path.join(
        vscode.workspace.workspaceFolders[0].uri.fsPath,
        baseOut
      );
    } else {
      outPath = path.join(file.dirname, baseOut);
    }
  } else {
    outPath = "";
  }

  return outPath;
}