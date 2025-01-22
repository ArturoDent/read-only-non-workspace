import * as vscode from 'vscode';

export const EXTENSION_NAME = "read-only.non-workspaceFiles";

export interface ExtensionSettings {
  enableReadonly: boolean,
  enableStatusBarButton: boolean,
  isStatusBarIconOnly: boolean
};

// export this to reduce getSettings() calls in statusBar.toggleStatusBarIcon
export let isStatusBarIconOnly: boolean;

/**
 * Get the settings
 * @returns {ExtensionSettings}
 */
export async function getSettings(): Promise<ExtensionSettings> {

  const config: vscode.WorkspaceConfiguration | undefined = vscode.workspace.getConfiguration(EXTENSION_NAME);

  let enableReadonly: boolean = await config.get('enable') ?? false;  // defaults are false
  let enableStatusBarButton: boolean = await config.get('statusBarButton') ?? false;
  // let isStatusBarIconOnly: boolean = await config.get('statusBarIconOnly') ?? false;
  isStatusBarIconOnly = await config.get('statusBarIconOnly') ?? false;

  return {
    enableReadonly,
    enableStatusBarButton,
    isStatusBarIconOnly,
  };
}
