import * as vscode from 'vscode';
import { EXTENSION_NAME, ExtensionSettings, getSettings } from "./config";
import { setTabsToReadOnly, setTabToReadOnly, isNonWorkspace } from "./processTabs";
import { schemeToIgnore } from './utilities';
import { setUpStatusBarItem, toggleStatusBarIcon } from './statusBar';
import * as sessionTracker from './sessionTracker';
import { registerReadOnlyCommands, disposeReadOnlyCommands  } from './capture';


export async function activate(context: vscode.ExtensionContext) {
	
	// const sessionID: string = vscode.env.sessionId;  // a5a72d90-2bf7-4c14-9fa0-277c625687261717798124729
	
	const sessionMap: Map<string, boolean> = await sessionTracker.initialize();

	const statusBarItem = await setUpStatusBarItem(context, sessionMap);	
	
	let settingsObject: ExtensionSettings = await getSettings();
	
	let tabGroups: vscode.TabGroups = vscode.window.tabGroups;
	
	if (settingsObject.enableReadonly) {
		await setTabsToReadOnly(tabGroups, statusBarItem);
	}
	
	if (settingsObject.enableStatusBarButton) {
		statusBarItem.show();
		await registerReadOnlyCommands(statusBarItem);
	}
	
	const fsPath = vscode.window.activeTextEditor?.document.uri.fsPath;
	if (fsPath) {
		toggleStatusBarIcon(fsPath, statusBarItem);
	}

	// ---------------------------------------------------------------------------------------------

	// this captures drag/drop into a window as well
	const onChangeEditor = vscode.window.onDidChangeActiveTextEditor(async event => {
		
		// onChangeEditor() is sometimes fired twice for some reason, first time event is undefined
		if (!event) {
			if (statusBarItem) statusBarItem.hide();
			return;
		}
		
		const Uri = event?.document?.uri;
		
		if (settingsObject.enableReadonly) {
			//  &&  not set to read in session
			if (Uri  &&  !schemeToIgnore(Uri.scheme)  &&  isNonWorkspace(Uri)) {
				
				if (sessionTracker.getFile(Uri.fsPath) === undefined)
					await setTabToReadOnly(Uri, true);

				await toggleStatusBarIcon(Uri.fsPath, statusBarItem);
			}
			else if (Uri  &&  !schemeToIgnore(Uri.scheme)  &&  !isNonWorkspace(Uri)) {
				
				await toggleStatusBarIcon(Uri.fsPath, statusBarItem);
			}
		}
		
		if (settingsObject.enableStatusBarButton) {
			if (Uri  &&  schemeToIgnore(Uri.scheme)) statusBarItem.hide();
			else {
				statusBarItem.show();
			}
		}
	});
	
  context.subscriptions.push(onChangeEditor);	

  // ---------------------------------------------------------------------------------------------
	
	// Use because can't capture the in-document click on hint text link to set writeable 
	// a locked file - when you try to type in it.
	const onSave = vscode.workspace.onDidSaveTextDocument(async event => {
	
		const filePath = event?.uri.fsPath;
		
		// check here if sessionTracker.getFile(event.uri.fsPath) is true (that means locked)
		// if so, swap the icon and set file to writeable
		
		if (filePath  &&  sessionTracker.getFile(event.uri.fsPath)) {
			await vscode.commands.executeCommand('workbench.action.files.resetActiveEditorReadonlyInSession');
		}		
	});
	
  context.subscriptions.push(onSave);	
	
	// --------------------------------------------------------------------------------------------

  const configChange = vscode.workspace.onDidChangeConfiguration(async (event) => {
    
    if (event.affectsConfiguration(`${EXTENSION_NAME}.enable`)) {  // = "read-only.non-workspaceFiles"

			settingsObject = await getSettings();
			
			if (settingsObject.enableReadonly) {
				const tabGroups: vscode.TabGroups = vscode.window.tabGroups;
				await setTabsToReadOnly(tabGroups, statusBarItem);
			}
		}
		else if (event.affectsConfiguration(`${EXTENSION_NAME}.statusBarButton`)) {  // = "read-only.non-workspaceFiles"

			settingsObject = await getSettings();
			
			if (settingsObject.enableStatusBarButton)
				statusBarItem.show();
			else statusBarItem.hide();
    }
  });
  
  context.subscriptions.push(configChange);
}


export function deactivate() { disposeReadOnlyCommands(); }
