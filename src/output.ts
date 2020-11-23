import * as vscode from 'vscode';

class OutputChannel {

    private output: vscode.OutputChannel;

    constructor(name: string) {
        this.output = vscode.window.createOutputChannel(name);
    }

    write(str: string): void {
        this.output.append(str);
    }

    writeln(str: string): void {
        this.output.appendLine(str);
    }

    show(preserveFocus = true): void {
        this.output.show(preserveFocus);
    }

    hide(): void {
        this.output.hide();
    }

    clear(): void {
        this.output.clear();
    }

    name(): string {
        return this.output.name;
    }

    printMinifyResult(file: string, minOutput: MinifyOutput): void {

        this.write(`[${file}]:`);

        if (minOutput.success && minOutput.errors.length === 0) {
            this.write(` OK - ${Math.abs(minOutput.efficiency)}% ${minOutput.efficiency < 0 ? 'bigger' : 'smaller' }\n`);
        } else {
            this.write('\n');
        }

        if (minOutput.warnings.length) {

            this.writeln(`\t[Warnings]: ${minOutput.warnings.length ? minOutput.warnings.length : 'None' }`);
            minOutput.warnings.forEach(w => {
                this.writeln(`\t\t- ${w}`);
            });

        }

        if (minOutput.errors.length) {

            this.writeln(`\t[Errors]: ${minOutput.errors.length ? minOutput.errors.length : 'None' }`);
            minOutput.errors.forEach(w => {
                this.writeln(`\t\t- ${w}`);
            });

        }

        if (!minOutput.success && minOutput.errors.length === 0) {
            this.writeln('\t[Errors]:');
            this.writeln('\t\t- No errors were reported but the minification failed! Opten an issue at the specific github repository');
        }

    }

    dispose(): void {
        this.output.dispose();
    }

}

export const output = new OutputChannel('PHP Minifier');