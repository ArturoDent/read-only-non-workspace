// import * as vscode from 'vscode';


export async function getfocusGroupCommand(viewColumn: Number): Promise<string> {

	// viewColumn is 1-based
	switch (viewColumn) {
		case 1:
			return "workbench.action.focusFirstEditorGroup";		
			break;
		case 2:
			return "workbench.action.focusSecondEditorGroup";	
			break;
		case 3:
			return "workbench.action.focusThirdEditorGroup";
			break;
		case 4:
			return "workbench.action.focusFourthEditorGroup";
			break;
		case 5:
			return "workbench.action.focusFifthEditorGroup";
			break;
		case 6:
			return "workbench.action.focusSixthEditorGroup";
			break;
		case 7:
			return "workbench.action.focusSeventhEditorGroup";
			break;
		case 8:
			return "workbench.action.focusEighthEditorGroup";
			break;

		default:
			return "";
			break;
	}
}

export function schemeToIgnore(scheme: string): boolean {
	
	const ignoreList = ['vscode-userdata', 'vscode-settings', 'output', 'git'];	
	return ignoreList.includes(scheme);
	// return (scheme === 'vscode-userdata'  ||  scheme === 'vscode-settings'  ||  scheme === 'output'  ||  scheme === 'git');
}

