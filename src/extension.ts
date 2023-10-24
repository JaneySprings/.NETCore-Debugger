import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';


export function activate(context: vscode.ExtensionContext) {
	if (fs.existsSync(path.join(context.extension.extensionPath, 'debugger'))) {
		context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('coreclr', new DotNetConfigurationProvider()));
		return;
	}

	vscode.window.showErrorMessage('The .NET Core Debugger is not installed. Download it at https://vsdebugger.azureedge.net');
}


class DotNetConfigurationProvider implements vscode.DebugConfigurationProvider {
	async resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, 
									config: vscode.DebugConfiguration, 
									token?: vscode.CancellationToken): Promise<vscode.DebugConfiguration | undefined> {
        return config;
	}
}