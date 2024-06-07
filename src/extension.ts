import * as vscode from 'vscode';
import { EXTENSION_NAME, DecoratorSettings, getSettings } from "./config";
import { setTabsToReadOnly, setTabToReadOnly, isNonWorkspace } from "./processTabs";
import { schemeToIgnore } from './utilities';



export async function activate(context: vscode.ExtensionContext) {

	let settingsObject: DecoratorSettings = await getSettings();
	
	let tabGroups: vscode.TabGroups = vscode.window.tabGroups;
	
	if (settingsObject.enableReadonly) {
		await setTabsToReadOnly(tabGroups);
	}

	// ---------------------------------------------------------------------------------------------

	// this captures drag/drop into a window as well
	const onChangeEditor = vscode.window.onDidChangeActiveTextEditor(async event => {
		
		if (!event) return;
		
		const Uri = event?.document?.uri;
		
		if (settingsObject.enableReadonly) {
			if (Uri  &&  !schemeToIgnore(Uri.scheme)  &&  isNonWorkspace(Uri))
				await setTabToReadOnly(Uri, true);
		}
	});
	
  context.subscriptions.push(onChangeEditor);	

  // ---------------------------------------------------------------------------------------------

  const configChange = vscode.workspace.onDidChangeConfiguration(async (event) => {
    
    if (event.affectsConfiguration(EXTENSION_NAME)) {  // = "read-only.non-workspaceFiles"

			settingsObject = await getSettings();
			
			if (settingsObject.enableReadonly) {
				const tabGroups: vscode.TabGroups = vscode.window.tabGroups;
				await setTabsToReadOnly(tabGroups);
			}
    }
  });
  
  context.subscriptions.push(configChange);
}


export function deactivate() {}
