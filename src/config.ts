import * as vscode from "vscode";

class Config {
  // General
  minifyOnSave: boolean | "yes" | "no" | "exists";
  hideButton: boolean | "always" | "never" | "auto";

  constructor() {
    const conf: Config = JSON.parse(
      JSON.stringify(vscode.workspace.getConfiguration("php-minifier"))
    );

    // General
    this.minifyOnSave = conf.minifyOnSave;
    this.hideButton = conf.hideButton;
  }
}

export function reloadConfig(): void {
  config = new Config();
}


export let config = new Config();
