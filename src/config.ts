import * as vscode from 'vscode';

export const EXTENSION_NAME = "read-only.non-workspaceFiles";

export interface ExtensionSettings {
  enableReadonly: boolean,
  enableStatusBarButton: boolean
}; 

/**
 * Get the settings, return an object<boolean>
 * @returns {ExtensionSettings}
 */
export async function getSettings(): Promise<ExtensionSettings> {

  const config: vscode.WorkspaceConfiguration | undefined = vscode.workspace.getConfiguration(EXTENSION_NAME);

  let enableReadonly: boolean = await config.get('enable') ?? false;
  let enableStatusBarButton: boolean = await config.get('statusBarButton') ?? false;  

  return {
    enableReadonly,
    enableStatusBarButton
  };
}
