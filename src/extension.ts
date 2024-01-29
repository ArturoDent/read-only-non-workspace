import * as vscode from 'vscode';
import { EXTENSION_NAME, DecoratorSettings, getSettings } from "./config";
import { setTabsToReadOnly, setTabToReadOnly, isNonWorkspace } from "./processTabs";



export async function activate(context: vscode.ExtensionContext) {

	const settingsObject: DecoratorSettings = await getSettings();
	let tabGroups: vscode.TabGroups = vscode.window.tabGroups;
	
	if (settingsObject.enableReadonly) {
		await setTabsToReadOnly(tabGroups);
	}

	// ---------------------------------------------------------------------------------------------

	vscode.workspace.onDidOpenTextDocument(event => {
		console.log();
	});

	vscode.window.onDidChangeActiveTextEditor(async event => {
		const Uri = event?.document?.uri;
		if (Uri && await isNonWorkspace(Uri)) setTabToReadOnly(Uri, true);
	});

  // ---------------------------------------------------------------------------------------------

  const configChange = vscode.workspace.onDidChangeConfiguration(async (event) => {
    
    if (event.affectsConfiguration(EXTENSION_NAME)) {  // = "read-only.non-workspaceFiles"

			const settingsObject: DecoratorSettings = await getSettings();
			if (settingsObject.enableReadonly) {
				const tabGroups: vscode.TabGroups = vscode.window.tabGroups;
				await setTabsToReadOnly(tabGroups);
			}
    }
  });
  
  context.subscriptions.push(configChange);
}


export function deactivate() {}
