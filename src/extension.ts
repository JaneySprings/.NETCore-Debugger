import { DotNetConfigurationProvider } from './provider';
import fetch from 'node-fetch';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';


export async function activate(context: vscode.ExtensionContext) {
	const extensionPath = context.extension.extensionPath;
	if (fs.existsSync(path.join(extensionPath, 'debugger'))) {
		context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('coreclr', new DotNetConfigurationProvider()));
		return;
	}

	const msPackageFilePath = 'https://github.com/dotnet/vscode-csharp/raw/main/package.json';
	const response = await fetch(msPackageFilePath)
		.then(response => response.json())
		.catch(() => notifyDebuggerNotFound(extensionPath));
	
	if (response?.runtimeDependencies === undefined)
		notifyDebuggerNotFound(extensionPath);

	const runtimeDependency = response.runtimeDependencies.find((d: any) => 
		d.id === 'Debugger' 
		&& d.platforms.includes(process.platform) && d.platforms.length === 1
		&& d.architectures.includes(process.arch) && d.architectures.length === 1
	);

	notifyDebuggerNotFound(extensionPath, runtimeDependency?.url);
}

async function notifyDebuggerNotFound(extPath: string, url?: string) {
	if (url === undefined) { 
		vscode.window.showErrorMessage('The .NET Core Debugger is not installed.');
		return;
	}

	const downloadResult = await vscode.window.showErrorMessage('The .NET Core Debugger is not installed.', 'Download');
	if (downloadResult !== 'Download') 
		return;

	const redirectResult = await vscode.env.openExternal(vscode.Uri.parse(url));
	if (redirectResult)
		vscode.window.showInformationMessage(`Place the downloaded debugger files in the "debugger" folder at ${extPath}.`);
}