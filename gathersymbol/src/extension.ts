// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { join, basename, extname} from 'path';
import { monitorEventLoopDelay } from 'perf_hooks';
import * as CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';




interface classInterface
{
    name: string;
    attribs: Map<string, any>,
    funcs: Map<string, any>
}

// Async function to fetch employee data
async function getFunctionList(uri: vscode.Uri){

    console.log(`getFunctionList : ${uri}`);
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

    fs.writeFileSync(filename, data, {
      flag: 'a+',
    });
  
    //const contents = readFileSync(filename, 'utf-8');
    //return contents;
  }

function readSymbolsRecursivly(symbol: vscode.DocumentSymbol,  clsObject: Map<string, classInterface>, clsname: string)
{ 
    
    if(symbol.kind == vscode.SymbolKind.Class)
    {
        clsname  = symbol.name;
        if(!clsObject.has(symbol.name))
        {
            var object:  classInterface = {name : clsname, attribs:new Map<string, any>(), funcs : new Map<string,any>()};
            clsObject.set(clsname, object);
        }
    }
    if (symbol.kind == vscode.SymbolKind.Method || symbol.kind == vscode.SymbolKind.Function || symbol.kind == vscode.SymbolKind.Module)
    {
        if (clsObject.has(clsname))
        {
            let details = symbol.detail.split(",");
            console.log(`symbol: ${symbol.name} class: ${clsname} details: ${details[0]}`);
            clsObject.get(clsname)?.funcs.set(symbol.name, details[0]);
        }
    }

    for(const child of symbol.children)
    {
        readSymbolsRecursivly(child, clsObject, clsname);
    }
}

// Function to read a file asynchronously
export async function readFileAsync(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Function to write to a file asynchronously
export async function writeFileAsync(filePath: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function createDrawioXml(outputFile: string): void {
    // Create the XML content
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <mxfile type="device" version="13.6.3" editor="www.draw.io">
      <diagram name="My Diagram" id="RxtJLfuvzW7E0uB5fT-I">
        <mxCell value="Rectangle" style="shape=rectangle" vertex="1" parent="1">
          <mxGeometry x="20" y="20" width="120" height="80" as="geometry"/>
        </mxCell>
      </diagram>
    </mxfile>`;

    // Write the XML content to the file
    fs.writeFileSync(outputFile, xmlContent);

    console.log(`draw.io XML file '${outputFile}' created successfully.`);
}

export async function ReplaceQtSlots(document: vscode.TextDocument, pathtosave: string )
{
    try{

        const filedata = await readFileAsync(document.fileName);
        var result = filedata.replace(/public slots:/g, 'public:');
        
        let filePath  = document.fileName as string;
        let newfilePath = join(pathtosave, basename(filePath));
        await writeFileAsync(newfilePath, result);

        return vscode.Uri.file(newfilePath)

    }catch(error)
    {
        console.error('Error updating file:', error);
        return document.uri;
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
       
        let dir  = "";
        if (fs.existsSync("/user_data"))
        {
            dir = '/user_data/drawio';
        }else{
            //user defined path
            dir  = "/Users/deepakthapliyal/Workspace/drawio";
        }
    
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        if(fs.existsSync(dir))
        {
            console.log(`created ${dir}`);
            
        }
        
        const headerfiles = await vscode.workspace.findFiles('**/*.h'); 
        
        let uuid = uuidv4();
        let xmlHeaderContent = `<mxfile host="app.diagrams.net" modified="2024-03-15T04:23:59.069Z" agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36" version="24.0.2" etag="aks6HkVxmZ68ohly_puq" type="device">
            <diagram id="${uuid}" name="Page-1">
            <mxGraphModel dx="2074" dy="1016" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
            <root>
            <mxCell id="0" />
            <mxCell id="1" parent="0" />`;
        let xmlFooterContent = ` 
            </root>
            </mxGraphModel>
                </diagram>
            </mxfile>`;
    
        let xmlClassContent = "";
        let groupXPos = 230;

        const pathtosave = join(dir, `jigsaw_headers.drawio` );
        for(const file of headerfiles)
        //if (vscode.window.activeTextEditor) 
        {
            clsObjectMap.clear();
            //const document = vscode.window.activeTextEditor.document;
            const document = await vscode.workspace.openTextDocument(file);
            let filePath  = document.fileName as string;
			const fileNameWithoutExtension = basename(filePath, extname(filePath));
			//const pathtosave = join(dir, `${fileNameWithoutExtension}.xml` );

            //console.log(getFunctionList(document.uri));
            //At presennt symbols does not add slots as class childrens, 
            //hence removing slots keyword and then read the file.
            let uri = ReplaceQtSlots(document, dir);

            const symbolsPromise = getFunctionList(await uri);
            if(symbolsPromise)
            {
                const symbols = await symbolsPromise as vscode.DocumentSymbol[];
                for(const symbol of symbols)
                {
                    readSymbolsRecursivly(symbol, clsObjectMap, symbol.name);
                }

                let data : string;
                
               
                // Iterate over the map using forEach
                clsObjectMap.forEach((value, key) => {
                    
                    // Generate a v4 UUID (random)
                    let uuid_parent = uuidv4();
                    let childYPos = 26;
                    let childCount = 0;

                    //syncWriteFile(pathtosave, xmlContent);
                    let xmlChildContent = "";
                    value.attribs.forEach((value, key)=>{
                        let data : string= "";
                        if (value == "private")
                        {
                            data  = data + "-";
                        }
                        else if (value == "protected")
                        {
                            data  = data + "#";
                        }else{
                            data  = data + "+";
                        }
                        data = data  + key;
                        //syncWriteFile(pathtosave, data);
                        //syncWriteFile(pathtosave, "--\n");
                    });

                   
                    let y = childYPos;
                    let width = 120;
                    let height = 80;
                    
                    value.funcs.forEach((value, key) =>{
                        let data : string= "";
                        if (value == "private")
                        {
                            data  = data + "-";
                        }
                        else if (value == "protected")
                        {
                            data  = data + "#";
                        }else{
                            data  = data + "+";
                        }

                        key = key.replace(/&/g, '&amp;');
                        key = key.replace(/</g, '&lt;');
                        key = key.replace(/</g, '&gt;');
                        data = data  + key;
                        
                       let uuid_child = uuidv4();
                       
                        xmlChildContent = xmlChildContent + `\n<mxCell id= "${uuid_child}" value="${data}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="${uuid_parent}">
                        <mxGeometry y="${y}" width="120" height="80" as="geometry"/>
                        </mxCell>`
                        y = y + childYPos;
                        childCount = childCount + 1;
                    });

                    let h =  childYPos * (childCount + 1);
                    xmlClassContent =  xmlClassContent + `\n<mxCell id ="${uuid_parent}" value="${value.name}" style="swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;" vertex="1" parent="1">
                    <mxGeometry x="${groupXPos}" y="300" width="160" height="${h}" as="geometry"/>
                    </mxCell>`

                    xmlClassContent = xmlClassContent + xmlChildContent;
                    groupXPos = groupXPos + 200;
                });     
            }
            //Check if the file exists
            if (fs.existsSync((await uri).fsPath)) {
                // Delete the file
                fs.unlinkSync((await uri).fsPath);
                console.log('File deleted successfully.');
            } else {
                console.log('File does not exist.');
            }
        }

        let xmlContent = xmlHeaderContent + xmlClassContent + xmlFooterContent;
        syncWriteFile(pathtosave, xmlContent);

        
	});
	context.subscriptions.push(disposable);
    
}

export async function writeSymbolsToFile(symbolMap: Map<string, vscode.DocumentSymbol[]>) {
    
    
}

// This method is called when your extension is deactivated
export function deactivate() {}
