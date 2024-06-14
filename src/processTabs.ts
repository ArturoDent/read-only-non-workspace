import * as vscode from 'vscode';
import * as utilities from "./utilities";
import * as sessionTracker from './sessionTracker';
import { schemeToIgnore } from './utilities';


/**
 * Used on reload and setting enable.
 * 
 * Cycle through all tabs and set to read-only if non-workspace
 * by calling setTabToReadOnly()
 * @param {vscode.TabGroups} tabGroups 
 * @param {vscode.StatusBarItem} statusBarItem 
 */
export async function setTabsToReadOnly(tabGroups: vscode.TabGroups, statusBarItem: vscode.StatusBarItem)  {

  const activeGroup = tabGroups.activeTabGroup;
  const activeTabs: vscode.Tab[] = await getActiveTabs(tabGroups);

  for await (const group of Object.entries(tabGroups.all)) {
    
    for await (const tab of group[1].tabs) {

      if (tab.input instanceof vscode.TabInputText) {

        if (!schemeToIgnore(tab.input.uri.scheme)) {
          
          if (!sessionTracker.getFile(tab.input.uri.fsPath)) { // if not already in the sessionSet
            
            if (isNonWorkspace(tab.input.uri))
              await setTabToReadOnly(tab.input.uri, tab.isActive);
          }
        }
      }
    }
  }
  if (activeTabs) await resetActiveTabs(tabGroups, activeGroup, activeTabs as vscode.Tab[]);
}


/**
 * Set this tab to read-only.  Because only the active tab can be set, re-set 
 * the active tabs and groups after.  Update the sessionTracker(path, true).
 * @param {vscode.Uri} Uri 
 * @param {boolean} active 
 */
export async function setTabToReadOnly(Uri: vscode.Uri, active: boolean) {
  
  const tabGroups: vscode.TabGroups = vscode.window.tabGroups;
  const activeGroup: vscode.TabGroup = tabGroups.activeTabGroup;
  const activeTabs: vscode.Tab[] = await getActiveTabs(tabGroups);
  
  // if not the active tab, make it active so can use the setActiveEditorReadonlyInSession command
  if (!active) await vscode.commands.executeCommand('vscode.open', Uri);
  
  await vscode.commands.executeCommand('workbench.action.files.setActiveEditorReadonlyInSession');
  
  // reset the active tab if it changed
  if (!active) await resetActiveTabs(tabGroups, activeGroup, activeTabs as vscode.Tab[]);
  
  sessionTracker.addFile(Uri.fsPath, true);
}

/**
 * Get an array of active tab in each group.
 * @param {vscode.TabGroups} tabGroups 
 * @returns {Promise<vscode.Tab[]>}
 */
export async function getActiveTabs(tabGroups: vscode.TabGroups): Promise<vscode.Tab[]> {
  return  tabGroups?.all?.map((group) => group?.activeTab ) as vscode.Tab[];
}

/**
 * Reset the active tab in each group.
 * And return focus to the last activeGroup/activeTab.
 * Need this because can set read-only the active tab only.
 * 
 * @param {vscode.TabGroups} tabGroups 
 * @param {vscode.TabGroup} activeGroup 
 * @param {vscode.Tab[]} activeTabs 
 */
export async function resetActiveTabs(tabGroups: vscode.TabGroups, activeGroup: vscode.TabGroup, activeTabs: vscode.Tab[]) {

  let index = 0;

  for await (const group of tabGroups.all) {

    const openOptions = { preserveFocus: false, viewColumn: group.viewColumn };
    const tab = activeTabs[index];

    if (tab.input instanceof vscode.TabInputText) 
      vscode.commands.executeCommand('vscode.open', tab.input.uri, openOptions);  // this is failing silently
    
    else if (tab.label === 'Settings'  &&  !tab.input)
      vscode.commands.executeCommand('workbench.action.openSettings2');  // focus Settings UI if it was active
    
    index++;
  }

	const focusGroupCommand = await utilities.getfocusGroupCommand(activeGroup.viewColumn);
	await vscode.commands.executeCommand(focusGroupCommand);
}


/**
 * The file is not in workspace if its folder is not a workspaceFolder.
 * @param {vscode.Uri} Uri 
 * @returns {boolean} file is not in the workspace
 */
export function isNonWorkspace(Uri: vscode.Uri): boolean {

  const folder = vscode.workspace.getWorkspaceFolder(Uri);
  return folder ? false : true;  
}