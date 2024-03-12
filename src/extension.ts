// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, basename, extname} from 'path';


interface classInterface
{
    name: string;
    attribs: Map<string, any>,
    funcs: Map<string, any>
}

// Async function to fetch employee data
async function getFunctionList(uri: vscode.Uri){
    if (vscode.window.activeTextEditor) {
        var active = vscode.window.activeTextEditor;
        return await new Promise((resolve, reject) => {
            setTimeout(function(){
                resolve(vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider',uri));
            }, 1000);
        });
    }   
}

function syncWriteFile(filename: string, data: any) {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */

    writeFileSync(filename, data, {
      flag: 'a+',
    });
  
    //const contents = readFileSync(filename, 'utf-8');
    //return contents;
  }

function readSymbolsRecursivly(symbol: vscode.DocumentSymbol,  clsObject: Map<string, classInterface>, clsname: string, pathtosave:string)
{ 
    console.log(`symbol: ${symbol}`);
    if(symbol.kind == 4)
    {
        
        clsname  = symbol.name;
        if(!clsObject.has(symbol.name))
        {
            var object:  classInterface = {name : clsname, attribs:new Map<string, any>(), funcs : new Map<string,any>()};
            clsObject.set(clsname, object);
        }
        
        let data = clsname + "\n";
        //syncWriteFile(pathtosave, data);

    }
    if(symbol.kind == 7)
    {
        if (clsObject.has(clsname))
        {
           clsObject.get(clsname)?.attribs.set(symbol.name, symbol.detail);
        };

        let data : string= "";
        if (symbol.detail == "private")
        {
            data  = data + "- ";
        }
        else if (symbol.detail == "protected")
        {
            data  = data + "# ";
        }else{
            data  = data + "+ ";
        }
        data = data  + symbol.name + "\n";

        //syncWriteFile(pathtosave, data);

    }
    if (symbol.kind == 5)
    {
        if (clsObject.has(clsname))
        {
            clsObject.get(clsname)?.funcs.set(symbol.name, symbol.detail);
        }
        let data : string= "";
        if (symbol.detail == "private")
        {
            data  = data + "- ";
        }
        else if (symbol.detail == "protected")
        {
         data  = data + "# ";
        }else{
            data  = data + "+ ";
        }

        data = data  + symbol.name + "\n";
        //syncWriteFile(pathtosave, data);
    }

    for(const child of symbol.children)
    {
        readSymbolsRecursivly(child, clsObject, clsname, pathtosave);
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

    const clsObjectMap = new Map<string, classInterface>();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "outliner" is now active!');

   

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('gathersymbol.helloWorld', async () => {

        console.log("Current directory:", __dirname);
        var fs = require('fs');
        var dir = join(__dirname,'drawio');
    
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        if(fs.existsSync(dir))
        {
            console.log(`created ${dir}`);
            
        }

        const headerfiles = await vscode.workspace.findFiles('**/*.h'); 
        //const pathtosave = join("/user_data/globalClassDiagram.txt");
        for(const file of headerfiles)
        {
            clsObjectMap.clear();
            const document = await vscode.workspace.openTextDocument(file);
            //var active = vscode.window.activeTextEditor;
            let filePath  =document.fileName as string;
			const fileNameWithoutExtension = basename(filePath, extname(filePath));
            
			const pathtosave = join(dir, `${fileNameWithoutExtension}.txt` );
            //console.log(getFunctionList());

            const symbolsPromise =  getFunctionList(document.uri);

            if(symbolsPromise)
            {
                const symbols = await symbolsPromise as vscode.DocumentSymbol[];
                for(const symbol of symbols)
                {
                    readSymbolsRecursivly(symbol, clsObjectMap, symbol.name, pathtosave);
                }

                let data : string;
                // // Iterate over the map using forEach
                clsObjectMap.forEach((value, key) => {
                    syncWriteFile(pathtosave, "\n\n" + value.name);

                    value.attribs.forEach((value, key)=>{
                        let data : string= "";
                        if (value == "private")
                        {
                            data  = data + "\n-";
                        }
                        else if (value == "protected")
                        {
                            data  = data + "\n#";
                        }else{
                            data  = data + "\n+";
                        }
                        data = data  + key;
                        //syncWriteFile(pathtosave, data);
                        //syncWriteFile(pathtosave, "--\n");
                    });
                    
                    
                    value.funcs.forEach((value, key) =>{
                        let data : string= "";
                        if (value == "private")
                        {
                            data  = data + "\n-";
                        }
                        else if (value == "protected")
                        {
                        data  = data + "\n#";
                        }else{
                            data  = data + "\n+";
                        }
                        data = data  + key;
                        syncWriteFile(pathtosave, data);
                    });
                    
                }); 
            }
        }
        
	});


	context.subscriptions.push(disposable);
    
}

export async function writeSymbolsToFile(symbolMap: Map<string, vscode.DocumentSymbol[]>) {
    
    
}

// This method is called when your extension is deactivated
export function deactivate() {}
