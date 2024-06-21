# Read-only: Non-workspace Files

This extension will automatically set any non-workspace files to **read-only** in the editor when enabled.  This does **NOT** change their read/write status in the filesystem.

This works for any non-workspace files upon start-up (or reload) of vscode and when opening a file in an existing workspace (such as by dragging and dropping from a file explorer).

Any file can be set to read-only (whether it is in the workspace or not).  Only non-workspace files are automatically set to read-only (if that setting is enabled), but this extension and its StatusBar button can be used on any file (except for a small number of special files like Settings, etc.).

Works in single and multi-root workspaces.

A lock icon will appear in the editor tab for any file set as read-only.

A Status Bar button can be enabled which will show the "R-O" (read-only) status of the current file and an action which can be taken (to lock or to unlock) on the current file which operates as a toggle when clicked.  

## Extension Settings

This extension contributes the following two settings:

* `Read-only > Non-workspace Files: Enable`: disabled by default

Enable to start setting non-workspace files as read-only in session.  

Disabling the extension does **NOT** unset any read-only files that may already be present.

You can undo any read-only file setting by attempting to type in that file.  VS Code will automatically offer a suggestion to change that file's read-only status.  However, if you then reload VS Code, that same file (if a non-workspace file) would again be marked as read-only.  

You can toggle or unset read-only with these commands:

```plaintext
File: Toggle Active Editor Read-only in Session

File: Reset Active Editor Read-only in Session
```

* `Read-only > Non-workspace Files: Status Bar Button`: disabled by default

Enable this to show a "button" on the Status Bar that shows an action that can be taken, so a locked/read-only file will show `R-O  $(lock-closed)  Press to UN-LOCK` and a file which is currently writeable will show `R-O  $(lock-open)  Press to LOCK`.  This button can be clicked to toggle the read-only status.  The editor tab will have a lock icon if it is set to read-only and no lock icon if it is writeable.  

 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; <img src="https://github.com/ArturoDent/read-only-non-workspace/blob/master/images/toggleStatusBarItem.gif?raw=true" width="500" height="200" alt="shows the statusbar button and toggle state"/>  

## Known Issues

If you have more than 8 editor groups open - and one of those beyond 8 is the active group - this extension cannot properly refocus the active editor group after setting any non-workspace files to read-only.

This extension will attempt to keep the Status Bar button showing the proper available action fo rthe current file: lock (make it read-only) or unlock (make a read-only file writeable).  There is no vscode extension api to directly do this however.  There are multiple ways to change the read-only status of the current file: (1) trigger one of the read-only session commands from the Command Palette, (2) click the Status Bar button provided by this extension, and (3) click the link in the suggestion text that pops up (to set to writeable) when you try to type in a locked (i.e., set to read-only) file.

This extension can handle (1) and (2) but there is no way to detect action (3) so the lock/unlock icon and text in the Status Bar button will be incorrect for that one case.  Despite what the button shows the actual read-only status for the current file is changed to writeable when you take action (3).  It will be corrected when you **save** that file.  

Unrelated to this extension, but if you want files to be marked and locked as read-only by vscode because they are read-only in the file system, then make sure you have this setting enabled:  `Files: Readonly From Permissions`

## Status Bar Button colors

You can set the foreground - the text and icon - colors in your `settings.json` like this:

```jsonc
 "workbench.colorCustomizations": {
    
    "readOnly.nonWorkspaceFiles.statusBarItemForeground": "#e41515"  // to change the default
    // the default is white for dark themes and black for light themes
 }
 ```

or

 ```jsonc
"workbench.colorCustomizations": {
  "[Monokai]": {                // for a specific theme
    "readOnly.nonWorkspaceFiles.statusBarItemForeground": "#229977"
  },
  "[Obsidian, Moon]": {        // for multiple themes
    "readOnly.nonWorkspaceFiles.statusBarItemForeground": "#229977"
  },
  "[*Dark*]": {               // for all *Dark* named themes, like myDark and myDark2
    "readOnly.nonWorkspaceFiles.statusBarItemForeground": "#229977"
  }
}
 ```

 The background and hover colors are determined by these other settings:

 ```jsonc
"workbench.colorCustomizations": {
    
  "readOnly.nonWorkspaceFiles.statusBarItemForeground": "#fff",   // text/icon color
  
  "statusBarItem.warningBackground": "#21c4bf",       // default is a reddish-brown
  "statusBarItem.warningHoverBackground": "#74d459",  // default is red
  "statusBarItem.warningHoverForeground": "#000",     // default is white
}
```

## Release Notes

* 0.1.0 Initial release.

* 0.1.1 Add a missing `await`.  
* 0.1.2 Simplfy scheme checking for `vscode-` files like settings and keybindings.  

* 0.2.0 Fix ignoring setting on onDidChangeActiveTextEditor.  
&emsp;&emsp; Ignore git and output schemes.

* 0.3.0 Add a toggle read-only StatusBarItem and associated setting.  
* 0.3.2 Switched sbItem text. Added icons contribution.  
