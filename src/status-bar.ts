import * as vscode from 'vscode';

class StatusBar {

    private _button: vscode.StatusBarItem;

    constructor() {
        this._button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
        this._button.text = 'Minify PHP';
        this._button.command = `php-minifier.minify_php`;
        this._button.tooltip = 'Minify current file, if possible :)';
    }

    showButton(): void {

        this._button.show();

    }

    hideButton(): void {

        this._button.hide();

    }

    showStats(eff: number, timeout = 5000): void {
            vscode.window.setStatusBarMessage(`$(graph) Output is ${Math.abs(eff)}% ${eff < 0 ? 'bigger' : 'smaller' }.`, timeout);
    }

    showMessage(str: string, timeout = 5000): void {
        vscode.window.setStatusBarMessage(str, timeout);
    }

}

export const statusBar = new StatusBar();
