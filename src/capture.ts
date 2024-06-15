import * as vscode from 'vscode'; 
import * as session from './sessionTracker';
import * as statusBar from './statusBar';
import { schemeToIgnore } from './utilities';

declare global {
  var resetDisposable: vscode.Disposable;
  var setDisposable: vscode.Disposable;
  var toggleDisposable: vscode.Disposable;
}


/**
 * Initial register of all the capture read-only commands
 * @param {vscode.StatusBarItem} statusBarItem 
 */
export async function registerReadOnlyCommands(statusBarItem: vscode.StatusBarItem) {
  await registerResetROCommand(statusBarItem);
  await registerSetROCommand(statusBarItem);
  await registerToggleROCommand(statusBarItem);
}


/**
 * A function that registers a reset (to writeable) read-only command thus
 * capturing the built-in reset command
 * @param {vscode.StatusBarItem} statusBarItem 
 */
export async function registerResetROCommand(statusBarItem: vscode.StatusBarItem) {

  globalThis.resetDisposable = vscode.commands.registerCommand('workbench.action.files.resetActiveEditorReadonlyInSession', async arg => {

    const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
    const fileScheme = vscode.window.activeTextEditor?.document.uri.scheme;
    
    if (filePath  &&  fileScheme  &&  !schemeToIgnore(fileScheme)) {
      // first dispose/deactivate this registration
      await globalThis.resetDisposable.dispose();
      
      // do the set-up work
      session.toggleMapStatus(filePath); 
      await statusBar.toggleStatusBarIcon(filePath, statusBarItem);
      
      // won't be captured because diposed above
      await vscode.commands.executeCommand('workbench.action.files.resetActiveEditorReadonlyInSession');
      
      // run this function again to register the command and capture the next reset read-only call
      await registerResetROCommand(statusBarItem);
    }
  });
}

/**
 * A function that registers a set (to read-ony) read-only command thus
 * capturing the built-in set command
 * @param {vscode.StatusBarItem} statusBarItem 
 */
export async function registerSetROCommand(statusBarItem: vscode.StatusBarItem) {

  globalThis.setDisposable = vscode.commands.registerCommand('workbench.action.files.setActiveEditorReadonlyInSession', async arg => {

    const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
    const fileScheme = vscode.window.activeTextEditor?.document.uri.scheme;
    
    if (filePath  &&  fileScheme  &&  !schemeToIgnore(fileScheme)) {
      await globalThis.setDisposable.dispose();
      
      session.toggleMapStatus(filePath); 
      await statusBar.toggleStatusBarIcon(filePath, statusBarItem);
      
      await vscode.commands.executeCommand('workbench.action.files.setActiveEditorReadonlyInSession');
      await registerSetROCommand(statusBarItem);
    }
  });
}

/**
 * A function that registers a toggle  read-only command thus
 * capturing the built-in toggle command
 * @param {vscode.StatusBarItem} statusBarItem 
 */
export async function registerToggleROCommand(statusBarItem: vscode.StatusBarItem) {

  globalThis.toggleDisposable = vscode.commands.registerCommand('workbench.action.files.toggleActiveEditorReadonlyInSession', async arg => {

    const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
    const fileScheme = vscode.window.activeTextEditor?.document.uri.scheme;
    
    if (filePath  &&  fileScheme  &&  !schemeToIgnore(fileScheme)) {
      await globalThis.toggleDisposable.dispose();
      
      session.toggleMapStatus(filePath); 
      await statusBar.toggleStatusBarIcon(filePath, statusBarItem);
      
      await vscode.commands.executeCommand('workbench.action.files.toggleActiveEditorReadonlyInSession');   
      await registerToggleROCommand(statusBarItem);
    }
  });
}

/**
 * Used in extension.ts deactivate() only
 */
export async function disposeReadOnlyCommands() {  
  global.resetDisposable.dispose();
  global.setDisposable.dispose();
  global.toggleDisposable.dispose();
}