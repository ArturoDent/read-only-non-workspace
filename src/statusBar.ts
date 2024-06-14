import * as vscode from 'vscode';

import { schemeToIgnore } from './utilities';
import * as sessionTracker from './sessionTracker';


/**
 * Register the status bar button handler command.
 * Initialize the status bar item/button.
 * 
 * @param {vscode.ExtensionContext} context - only used to subscribe to disposables
 * @param {Map<string, boolean>} session - fsPath to true/false/undefined
 * @returns 
 */
export async function setUpStatusBarItem(context: vscode.ExtensionContext, session: Map<string, boolean>) {

  let disposable = vscode.commands.registerCommand('read-only.non-workspaceFiles.statusBarItemHandler', async arg => {

    const thisURI = vscode.window.activeTextEditor?.document?.uri;
    
    if (thisURI  &&  !schemeToIgnore(thisURI.scheme)) {
      
      // all toggling of the session map and statusbar icon handled in the captured command
      await vscode.commands.executeCommand('workbench.action.files.toggleActiveEditorReadonlyInSession');
      
      // refocus the active editor after clciking the status bar button
      await vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
    }
  });
  context.subscriptions.push(disposable);

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  context.subscriptions.push(statusBarItem);

  statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
  // is there a prominent foreground?
  statusBarItem.color = new vscode.ThemeColor('statusBarItem.prominentForeground');
  
  // the initial editor when vscode loads
  const thisURI = vscode.window.activeTextEditor?.document?.uri;
  if (!thisURI) statusBarItem.hide();
  else if (!schemeToIgnore(thisURI.scheme)) statusBarItem.show();
  
  // statusBarItem.name = "Toggle read-only for the current file";
  statusBarItem.tooltip = "Toggle read-only status for the current file";

  let myCommand: vscode.Command = {
    title: "some title",
    command: 'read-only.non-workspaceFiles.statusBarItemHandler',
    // arguments: [thisURI]
  };
  statusBarItem.command = myCommand;
  
  return statusBarItem;
}

/**
 * Toggle the lock/inlock icon text in status bar
 * @param {string} fsPath 
 * @param {vscode.StatusBarItem} statusBarItem 
 */
export async function toggleStatusBarIcon(fsPath: string, statusBarItem: vscode.StatusBarItem) {
  
  if (sessionTracker.getFile(fsPath)) statusBarItem.text = "$(unlock) R-O UNLOCK";
  else statusBarItem.text = "$(lock) R-O LOCK";
}
