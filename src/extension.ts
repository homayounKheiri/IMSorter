import * as vscode from 'vscode';
import fs from 'fs';

type TConfig = {
	importsKey: string[];
	// divider: string;
};

function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('IMSorter.sorter', () => {
			sortImports();
	});

	context.subscriptions.push(disposable);
}

async function sortImports() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
			vscode.window.showErrorMessage('No active editor found.');
			return;
	}

	const configPath = vscode.workspace.rootPath + '/imsorter.json';
	try {
			const configFile = fs.readFileSync(configPath, 'utf-8');

			const config: TConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

			const importsKey = config.importsKey;
			// const divider = config.divider;

			const document = editor.document;
			const text = document.getText();
			const tempLines = text.split('\n');

			const lines = [...tempLines];

			lines.forEach((line, i, arr) => {
				if (line.startsWith("import")) {
					let numOfOpenParenthesis;
					let numOfCloseParenthesis;

					while (true) {
						numOfOpenParenthesis = lines[i].split("{").length - 1;
						numOfCloseParenthesis = lines[i].split("}").length - 1;

						const condition = 
							numOfOpenParenthesis > numOfCloseParenthesis ||
							lines[i + 1]?.trim().startsWith("from");
							
						if (condition && i < lines.length - 1) {
							lines[i] = lines[i].trim() + " " + lines.splice(i + 1, 1).join().trim();
						}
						else {
							break;
						}
					}
				}
			});

			const imports = lines.filter(line => line.trim().startsWith('import'));

			const sortedImports = imports.sort((a, b) => {
					let tempIndex = -1;
					
					tempIndex = importsKey.findIndex(key => a.includes(key));
					const indexA = tempIndex > -1 ? tempIndex : importsKey.length;
					
					tempIndex = importsKey.findIndex(key => b.includes(key));
					const indexB = tempIndex > -1 ? tempIndex : importsKey.length;
					return indexA - indexB;
			});

			let sortedText = '';
			let currentKeyIndex = -1;
			for (const imp of sortedImports) {
					const index = importsKey.findIndex(key => imp.includes(key));
					if (index !== currentKeyIndex) {
							if (currentKeyIndex !== -1) {
									sortedText += '\n';
							}
							currentKeyIndex = index;
					}
					sortedText += imp.trim() + '\n';
			}

			const mainLines = lines.filter(line => !line.trim().startsWith("import") );
			const resultText = sortedText + '\n' + mainLines.join('\n').trim();

			editor.edit(editBuilder => {
				const start = new vscode.Position(0, 0);
				const end = new vscode.Position(document.lineCount, 0);
				const range = new vscode.Range(start, end);
				editBuilder.replace(range, resultText);
			});

			vscode.window.showInformationMessage('Imports sorted successfully.');
	} catch (error) {
			vscode.window.showErrorMessage('IMSorter Config File not Found or Is Invalid.');
	}
}

function mylog(...log: any[]) {
	console.log("MYLOG", ...log)
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};