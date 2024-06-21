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

  statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  statusBarItem.color = new vscode.ThemeColor('readOnly.nonWorkspaceFiles.statusBarItemForeground');
  
  // the initial editor when vscode loads
  const thisURI = vscode.window.activeTextEditor?.document?.uri;
  if (!thisURI) statusBarItem.hide();
  else if (!schemeToIgnore(thisURI.scheme)) statusBarItem.show();
  
  const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab?.label;
  statusBarItem.tooltip = new vscode.MarkdownString("Toggle `read-only` status for **" + activeTab + "**");

  let myCommand: vscode.Command = {
    title: "some title",
    command: 'read-only.non-workspaceFiles.statusBarItemHandler'
    // arguments: [thisURI]
  };
  statusBarItem.command = myCommand;
  
  return statusBarItem;
}

/**
 * Toggle the lock/inlock icon text and tooltip in the status bar
 * @param {string} fsPath 
 * @param {vscode.StatusBarItem} statusBarItem 
 */
export async function toggleStatusBarIcon(fsPath: string, statusBarItem: vscode.StatusBarItem) {
  
  // if (sessionTracker.getFile(fsPath))
  //   statusBarItem.text = "$(unlock) R-O UNLOCK";
  // else if (statusBarItem.text !== "$(lock) R-O LOCK")
  //   statusBarItem.text = "$(lock) R-O LOCK";  
  
  if (sessionTracker.getFile(fsPath))
    statusBarItem.text = "R-O  $(lock-closed)  Press to UN-LOCK";
  else if (statusBarItem.text !== "R-O  $(lock-open)  Press to LOCK")
    statusBarItem.text = "R-O  $(lock-open)  Press to LOCK";  
  
  const activeTabLabel = vscode.window.tabGroups.activeTabGroup.activeTab?.label;
  if (activeTabLabel)
    statusBarItem.tooltip = new vscode.MarkdownString("Toggle `read-only` status for **" + activeTabLabel + "**");
}
