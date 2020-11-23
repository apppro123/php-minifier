import * as vscode from "vscode";
import * as path from "path";
import { output } from "./output";
import { isMinified, getOutPath, str_ireplace } from "./utils";
import { File } from "./fs";
import { statusBar } from "./status-bar";

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
    const minifiedCode = minify_PHP(phpText);
    new File(outPath).write(minifiedCode);
  } else {
    vscode.window.showErrorMessage("Language not supported.");
  }
}

function no_comments(phpText: string): string {
    console.log(phpText);
    const no_comments = phpText.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    return no_comments;
  }


  function minify_PHP(phpText: string): string {
      //first time I replace phpText, after I always take minifiedText
      //replace all php comments
      let minifiedText = phpText.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); 
      //remove white space
      minifiedText = minifiedText.replace(/\r/g, '');
      minifiedText = minifiedText.replace(/\n/g, '');
      minifiedText = minifiedText.replace(/\t/g, '');
      //remove html comments
      minifiedText = minifiedText.replace(/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/g, '');
    return minifiedText;
  }
