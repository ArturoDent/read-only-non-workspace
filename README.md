# Read-only: Non-workspace Files

This extension will automatically set any non-workspace files to **read-only** in the editor.  This does **NOT** change their read/write status in the filesystem.

This works for any non-workspace files upon start-up (or reload) of vscode and when opening a file in an existing workspace (as by dragging and dropping from a file explorer for example).

Works in single and multi-root workspaces.

A lock icon will appear in the editor tab for any file set as read-only.

## Extension Settings

This extension contributes the following setting:

* `Read-only > Non-workspace Files: Enable`: enable/disable this extension

Disabling the extension does **NOT** unset any read-only files that may already be present.

You can undo any read-only file setting by attempting to type in that file.  VS Code will automatically offer a suggestion to change that file's read-only status.  However, if you then reload VS Code, that same file (if a non-workspace file) would again be marked as read-only. Or, if you leave and return to a file that is non-workspace, it will be remarked and locked as read-only by this extension.  

You can toggle or unset `read-only` with these commands:

```plaintext
File: Toggle Active Editor Read-only in Session

File: Reset Active Editor Read-only in Session
```

## Known Issues

If you have more than 8 editor groups open - and one of those beyond 8 is the active group - this extension cannot properly refocus the active editor group after setting any non-workspace files to read-only.

Unrelated to this extension, but if you want files to be marked and locked as read-only because they are read-only in the file system, then make sure you have this setting enabled:  `Files: Readonly From Permissions`

## Release Notes

* 0.1.0 Initial release.

* 0.1.1 Add a missing `await`.  
* 0.1.2 Simplfy scheme checking for `vscode-` files like settings and keybindings.  

* 0.2.0 Fix ignoring setting on onDidChangeActiveTextEditor.  
&emsp;&emsp; Ignore git and output schemes.

