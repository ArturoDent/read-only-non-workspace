import * as vscode from 'vscode';
import * as utilities from "./utilities";


export async function setTabsToReadOnly(tabGroups: vscode.TabGroups)  {

  const activeGroup = tabGroups.activeTabGroup;
  const activeTabs: vscode.Tab[] = await getActiveTabs(tabGroups);

  for await (const group of Object.entries(tabGroups.all)) {
    
    for await (const tab of group[1].tabs) {

      if (tab.input instanceof vscode.TabInputText) {

        if (tab.input.uri.scheme !== 'vscode-userdata'  &&  tab.input.uri.scheme !== 'vscode-settings') {
          if (await isNonWorkspace(tab.input.uri)) await setTabToReadOnly(tab.input.uri, tab.isActive);
        }
      }
    }
  }
  if (activeTabs) await resetActiveTabs(tabGroups, activeGroup, activeTabs as vscode.Tab[]);
}


export async function setTabToReadOnly(Uri: vscode.Uri, active: boolean)  {

    // if not the active tab, make it active so can use the setActiveEditorReadonlyInSession command
  if (!active) await vscode.commands.executeCommand('vscode.open', Uri);
  await vscode.commands.executeCommand('workbench.action.files.setActiveEditorReadonlyInSession');
}


export async function getActiveTabs(tabGroups: vscode.TabGroups): Promise<vscode.Tab[]> {
  return  tabGroups?.all?.map((group, index) => group?.activeTab ) as vscode.Tab[];
}


export async function resetActiveTabs(tabGroups: vscode.TabGroups, activeGroup: vscode.TabGroup, activeTabs: vscode.Tab[]) {

  let index = 0;

  for await (const group of tabGroups.all) {

    const openOptions = { preserveFocus: false, viewColumn: group.viewColumn };
    const tab = activeTabs[index];

    if (tab.input instanceof vscode.TabInputText) {
      vscode.commands.executeCommand('vscode.open', tab.input.uri, openOptions);  // this is failing silently
    }
    index++;
  }

	const focusGroupCommand = await utilities.getfocusGroupCommand(activeGroup.viewColumn);
	await vscode.commands.executeCommand(focusGroupCommand);

    // let showOptions: vscode.TextDocumentShowOptions = { viewColumn: group.viewColumn, preserveFocus: false, preview: tab.isPreview };
   
    // if (group.activeTab.input instanceof vscode.TabInputText)  // added this, TODO test
    //   await vscode.window.showTextDocument(tab.input?.uri, showOptions); 
    
    // await vscode.commands.executeCommand('vscode.open', uri);
  
}


export async function isNonWorkspace(Uri: vscode.Uri): Promise<boolean> {
  // folder is undefined if uri not in workspace
  const folder = vscode.workspace.getWorkspaceFolder(Uri);
  return folder ? false : true;  
}