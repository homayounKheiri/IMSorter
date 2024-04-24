import * as vscode from 'vscode';
import fs from 'fs';

type TConfig = {
	importsKey: string[];
	// divider: string;
};

function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('IMSorter.sorter', () => {
		doIt();
	});

	context.subscriptions.push(disposable);
}

async function doIt() {
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

			const lines = cleanImports([...tempLines]);

			const imports = lines.filter(line => line.trim().startsWith('import'));
			const sortedImports = sortImports(imports, importsKey);
			let sortedText = groupImports(sortedImports, importsKey);

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

function cleanImports(lines: string[]) {
	lines.forEach((line, i, arr) => {
		if (line.startsWith("import")) {
			let numOfOpenParenthesis;
			let numOfCloseParenthesis;

			while (true) {
				numOfOpenParenthesis = lines[i].split("{").length - 1;
				numOfCloseParenthesis = lines[i].split("}").length - 1;

				const condition = numOfOpenParenthesis > numOfCloseParenthesis ||
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
	return lines;
}

function sortImports(imports: string[], importsKey: string[]) {
	return imports.sort((_a, _b) => {
		let tempIndex = -1;


		const a = extractDirectoryFromString(_a);
		const b = extractDirectoryFromString(_b);
		
		tempIndex = importsKey.findIndex(key => !!a.match(verifyRgx(key))?.length);
		const indexA = tempIndex > -1 ? tempIndex : importsKey.length;
		
		tempIndex = importsKey.findIndex(key => !!b.match(verifyRgx(key))?.length);
		const indexB = tempIndex > -1 ? tempIndex : importsKey.length;
		return indexA - indexB;
});
}

function extractDirectoryFromString(str: string) {
	let pattern = /(["'])(.*?)\1/;
	let match = str.match(pattern);
	
	if (match && match[2]) {
			return match[2];
	} else {
			return str;
	}
}

function groupImports(sortedImports: string[], importsKey: string[]) {
	let sortedText = '';
	let currentKeyIndex = -1;
	for (const _imp of sortedImports) {
		const imp = extractDirectoryFromString(_imp);

		const index = importsKey.findIndex(key => imp.match(verifyRgx(key))?.length);
		if (index !== currentKeyIndex) {
			if (currentKeyIndex !== -1) {
				sortedText += '\n';
			}
			currentKeyIndex = index;
		}
		sortedText += _imp.trim() + '\n';
	}
	return sortedText;
}

function isStringRgx(term: string) {
	return new RegExp(term) !== null;
}

function verifyRgx(term: string) {
	if (isStringRgx(term)) {
		return new RegExp(term);
	}
	else {
		return term;
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