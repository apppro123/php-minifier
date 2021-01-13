import * as vscode from "vscode";
import { isMinified, getOutPath } from "./utils";
import { File } from "./fs";

export function minifyDocument(doc: vscode.TextDocument): void {
  const phpText = doc.getText();
  //const baseName = path.basename(doc.fileName);

  if (isMinified(doc)) {
    // output.printMinifyResult(baseName, {
    //     success: false,
    //     warnings: [],
    //     errors: ['File already minified!']
    // });
    vscode.window.showErrorMessage("File already minified!");
    return;
  }
  // Minify
  if (doc.languageId === "php") {
    const outPath = getOutPath(doc);
    const minifiedCode = minifyPHP(phpText);
    new File(outPath).write(minifiedCode);
  } else {
    vscode.window.showErrorMessage("Language not supported.");
  }
}

  function minifyPHP(phpText: string): string {
      //replace all html comments
      let minifiedText = phpText.replace(/<!--[\s\S]*?-->/g, ''); 
      //remove php comments
      minifiedText = minifiedText.replace(/\/\*[\s\S]*?\*\/|(?<!\:)\/\/.*/g, '');
      //remove white space
      minifiedText = minifiedText.replace(/\r/g, '');
      minifiedText = minifiedText.replace(/\n/g, '');
      minifiedText = minifiedText.replace(/\t/g, '');

    return minifiedText;
  }