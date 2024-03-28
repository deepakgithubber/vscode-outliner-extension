// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { join, basename, extname, resolve} from 'path';
import { monitorEventLoopDelay } from 'perf_hooks';
import { v4 as uuidv4 } from 'uuid';
import { exec, execSync} from 'child_process';
import { stdout } from 'process';
import { dir } from 'console';
import { serialize } from 'v8';


interface classInterface
{
    name: string;
    base: string;
    uuid: string;
    attribs: Map<string, any>;
    funcs: Map<string, [string, number, string, string]>;
}

// Async function to fetch employee data
async function getFunctionList(uri: vscode.Uri){
    return await new Promise((resolve, reject) => {
        setTimeout(function(){
            resolve(vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider',uri));
        }, 1000);
    });
    
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

function readSymbolsRecursivlyFromHeader(headerfile: string, symbol: vscode.DocumentSymbol, srcSymbols:vscode.DocumentSymbol[] , srcfiles: vscode.Uri[],clsObject: Map<string, classInterface>, clsname: string)
{ 
   

    if(symbol.kind === vscode.SymbolKind.Class)
    {
        const data = readInheritance(headerfile).toString();
        const lines = data.toString().split("\n");
        const map = new Map<string, string>(); 
        for(const line of lines)
        {
            const [key, value] = line.split(" ");
            if(key && value)
            {
                map.set(key, value);
            } 
        }
        //console.log(`header: ${headerfile} data: ${data} base: ${baseCls}`);

        clsname = symbol.name;
        if(!clsObject.has(symbol.name))
        {
            let basecls: string = "";
            if(map.has(clsname))
            {
                basecls = map.get(clsname) as string;
                console.log(`classname : ${clsname} base: ${basecls}`);
            }
            var object:  classInterface = {uuid: uuidv4(), name : clsname, attribs:new Map<string, any>(), funcs : new Map<string,any>(), base: basecls};
            clsObject.set(clsname, object);
        }
    }
    if (symbol.kind === vscode.SymbolKind.Method || symbol.kind === vscode.SymbolKind.Function || symbol.kind === vscode.SymbolKind.Module)
    {
        if (clsObject.has(clsname))
        {
            let details = symbol.detail.split(",");
            let fname  = symbol.name.split("(")[0];
            let uuid = uuidv4();

            let line  = searchSymbolRecursivelyInSource(srcSymbols, symbol);
            let metadata : [string, number, string, string] = [details[0], line, "None", uuid];
            
            clsObject.get(clsname)?.funcs.set(symbol.name, metadata);


            searchTextInFilesSync(fname, srcfiles);
        }
    }

    for(const child of symbol.children)
    {
        readSymbolsRecursivlyFromHeader(headerfile, child, srcSymbols, srcfiles, clsObject, clsname);
    }
}

// Function to read a file asynchronously
async function readFileAsync(filePath: string): Promise<string> {
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
async function writeFileAsync(filePath: string, data: string): Promise<void> {
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

function ReplaceQtSlots(document: vscode.TextDocument, pathtosave: string )
{
    try{

        const filedata = fs.readFileSync(document.fileName);
        var result = filedata.toString().replace(/public slots:/g, 'public:');
        
        let filePath  = document.fileName as string;
        let newfilePath = join(pathtosave, basename(filePath));
        fs.writeFileSync(newfilePath, result);

        return vscode.Uri.file(newfilePath);

    }catch(error)
    {
        //console.error('Error updating file:', error);
        return document.uri;
    }
}

function searchTextInFilesSync(searchString: string, sourcefiles: vscode.Uri[])
{
    let visited: Set<string> = new Set();
    let result : string = "";
    const searchPromises = sourcefiles.map(async (src) => {
        const directoryPath = vscode.Uri.joinPath(src, '..').fsPath;
        if(!visited.has(directoryPath))
        {
            const command = `grep -rn "${searchString}" ${directoryPath}`;
            //setTimeout(() => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        //console.log(`Error executing command: ${error.message}`);
                    } else if (stderr) {
                        //console.log(`Command encountered an error: ${stderr}`);
                    } else {
                        fs.appendFileSync(join(getFileSaveLocation(true), `${searchString}.txt`), stdout);
                    }
                });
            
            visited.add(directoryPath);
        }
    });
}
// Function to read a file asynchronously
async function searchTextInFiles(searchString: string, sourcefiles: vscode.Uri[]): Promise<string> {
   
    return new Promise<string>((resolve, reject) => {
        let visited: Set<string> = new Set();
        let result : string = "";
        const searchPromises = sourcefiles.map(async (src) => {
            const directoryPath = vscode.Uri.joinPath(src, '..').fsPath;
            if(!visited.has(directoryPath))
            {
                const command = `grep -rn "${searchString}" ${directoryPath}`;
                //setTimeout(() => {
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            reject(`Error executing command: ${error.message}`);
                        } else if (stderr) {
                            reject(`Command encountered an error: ${stderr}`);
                        } else {
                            fs.appendFile(join(getFileSaveLocation(true), `${searchString}.txt`), stdout, function (err) {
                                if (err) {throw err;}
                                //console.log('Saved!');
                              });
                            
                            resolve(stdout);
                        }
                    });
                    
                //}, 10000);
                
                visited.add(directoryPath);
            }
        });
    });
}

function formatValueToXml(key: string)
{
    let result = key.replace(/&/g, '&amp;');
    if(key.includes('<')){
        result = result.replace(/</g, '&lt;');
        result = result.replace(/>/g, '&gt;');
    }
    return result;
}

function getFileSaveLocation(temp:boolean= false)
{
    let dir  = "";
    if (fs.existsSync("/user_data"))
    {
        dir = '/user_data/drawio';
    }else{
        //user defined path
        dir  = "/Users/deepakthapliyal/Workspace/drawio";
    }

    if(temp)
    {
        dir = join(dir, "temp");
    }


    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}

function searchSymbolRecursivelyInSource(symbols: vscode.DocumentSymbol[], searchSymbol: vscode.DocumentSymbol)
{

    for(const symbol of symbols)
    {
        if(symbol.name === searchSymbol.name)
        {
            return symbol.range.start.line + 1;
        }
        searchSymbolRecursivelyInSource(symbol.children,searchSymbol); 
    }

    return -1;

}

function getBaseClassConnectionXml(uuid: string, baseClass:string, fileObjMap: Map<string, Map<string, classInterface>>)
{
    let resultXml :string = "";
    fileObjMap.forEach((value, key) =>{
        let filename = key;
        let clssMap = value;

        clssMap.forEach((value, key) =>{

            if(key === baseClass)
            {
                resultXml =  `\n<mxCell id="${uuidv4()}" value="" style="endArrow=block;endSize=10;endFill=0;shadow=0;strokeWidth=1;rounded=0;curved=0;edgeStyle=elbowEdgeStyle;elbow=vertical;" parent="1" source="${uuid}" target="${value.uuid}" edge="1">
                <mxGeometry width="160" relative="1" as="geometry">
                <mxPoint x="200" y="203" as="sourcePoint" />
                <mxPoint x="200" y="203" as="targetPoint" />
                </mxGeometry>
                </mxCell>`;
            }
        });
    });

    return resultXml;

}

function getConnectionXml(cls: string, functionName: string, sourceUUID: string, fileObjMap: Map<string, Map<string, classInterface>>, path: string)
{
    const filePath = join(getFileSaveLocation(true), `${functionName}.txt`);
    if(!fs.existsSync(filePath)) {return;}

    let searchResult = fs.readFileSync(filePath);
    let foundFiles = searchResult.toString().split('\n');
    let foundModuleAtLine : number = Number.MAX_SAFE_INTEGER;
    let targetUUID = ""; 

    for(const file of foundFiles)
    {
        if (file === path) { continue;}

        const metadata      = file.split(':');
        const filePath      = metadata[0];
        const foundAtLine   = metadata[1];

        if (foundAtLine === "undefined") {continue;}

        if(fileObjMap.has(filePath))
        {
            let clsInterfaceObj = fileObjMap.get(filePath);
            clsInterfaceObj?.forEach((value, key) =>{
                if(key !== cls) 
                {
                    value.funcs.forEach(async (value, key) =>{
                        let moduleAtLine  = value[1];
                        if(moduleAtLine < parseInt(foundAtLine))
                        {
                            if(foundModuleAtLine > moduleAtLine)
                            {
                                foundModuleAtLine = moduleAtLine;
                                targetUUID = value[3];
                            }
                        }       
                    });
                }
            });
        }
        else{
            //console.log(`map does not have the key : `, filePath);
        }
    }

    //console.log(`source id : ${sourceUUID} target id : ${targetUUID}`);

    let xml : string  = "";
    if(targetUUID){
        let uuid = uuidv4();
        let xml = `\n<mxCell id="${uuid}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="${sourceUUID}" target="${targetUUID}">
            <mxGeometry relative="1" as="geometry" />
            </mxCell>`;
    }

    return xml;

}

function readInheritance(file: string) 
{
    const cmd = `grep -E 'class [A-Za-z0-9_]+ : [A-Za-z0-9_]+|class [A-Za-z0-9_]+ : [A-Za-z0-9_]+[ ]*[,{]' ${file} | awk '{print $2, $5}'`;
    return execSync(cmd);
    //console.log(executeCommand(cmd));
}

function readSymbols(headerfile: string, srcfile: string, symbolsFromHeader: vscode.DocumentSymbol[], symbolsFromSource: vscode.DocumentSymbol[],srcfiles: vscode.Uri[],fileObjMap: Map<string, Map<string, classInterface>>)
{

    //console.log(`readSymbols : source file : ${srcfile}`);
    const clsObjectMap = new Map<string, classInterface>();

    if(symbolsFromHeader)
    {
        for(const Symbol of symbolsFromHeader)
        {
            readSymbolsRecursivlyFromHeader(headerfile, Symbol, symbolsFromSource, srcfiles, clsObjectMap, Symbol.name);   
        }

        if(!fileObjMap.has(srcfile))
        {
            fileObjMap.set(srcfile, clsObjectMap);
        }
    }
}

function appendClassXmlDataHeader(fileObjMap: Map<string, Map<string, classInterface>>, path: string, xmlConnections: string[])
{

    console.log("started executing appendClassXmlDataHeader ....");
    let classHierarchyMap   = new Map<string, classInterface[]>();
    let data: string        = "";
    
    fileObjMap.forEach((clsObjMap, filePath)=>
    {   
        clsObjMap.forEach((clsInterfaceObj, className) => {
            
            if(clsInterfaceObj.base.trim().length === 0 || clsInterfaceObj.base.startsWith('Q'))
            {
                if(!classHierarchyMap.has(className))
                { 
                    classHierarchyMap.set(className, [clsInterfaceObj]);
                }
                else{
                    //always at the base class Interface at the top of array
                    classHierarchyMap.get(className)?.unshift(clsInterfaceObj);
                }
            }
            else{
                if(!classHierarchyMap.has(clsInterfaceObj.base))
                {
                    classHierarchyMap.set(clsInterfaceObj.base, [clsInterfaceObj]);
                }else{
                    classHierarchyMap.get(clsInterfaceObj.base)?.push(clsInterfaceObj);
                }
            }
        });
    });


    let nodeXPos: number    = 0;
    classHierarchyMap.forEach((clsInterfaceObjArray, base) =>{

        let nodeYPos = 300;
        let idx:  number =  0;
        console.log(`base : ${base}`);
        for(const clsInterfaceObj of clsInterfaceObjArray)
        {
            console.log(`derived : ${clsInterfaceObj.name}`);
            // let xPos = 0;
            // if(idx === 0)
            // {
            //     xPos = nodeXPos +  (200 * (clsInterfaceObjArray.length - 1)/2);
            // }else{
            //     nodeXPos = nodeXPos + 200;
            //     xPos = nodeXPos;
            // }

            if(base.startsWith('Q'))
            {
                appendClassXmlDataHeaderUtil(clsInterfaceObj, fileObjMap, path, xmlConnections,"1", nodeXPos, nodeYPos);
            }else{
                appendClassXmlDataHeaderUtil(clsInterfaceObj, fileObjMap, path, xmlConnections, clsInterfaceObjArray[0].uuid, nodeXPos, nodeYPos);
            }
            nodeXPos =  nodeXPos + 200;

        }
    });



}

function appendClassXmlDataHeaderUtil(clsInterfaceObj: classInterface, fileObjMap: Map<string, Map<string, classInterface>>, path: string, xmlConnections: string[], baseUUID: string, nodeXPos: number,nodeYPos:number)
{
    try 
    {
        let modifiers = new Map([
            ['private', '-'],
            ['protected', '#'],
            ['declaration', '+']
        ]);

        let y               = 26;
        let parentuuid      = clsInterfaceObj.uuid;
        let childCount      = 0;
        let xmlChildContent = "";
        const childYIncrPos = 26;
        let xmlClassContent = "";

        clsInterfaceObj.funcs.forEach(async (value, functionName) => {
            const formattedValue = formatValueToXml(functionName);
            let data = modifiers.get(value[0]) + formattedValue;
            let fname = functionName.split("(")[0];

            const connectionXML = getConnectionXml(clsInterfaceObj.name, fname, value[3], fileObjMap, path);
            
            let fontColor: string = "";
            if (connectionXML === " "){
                fontColor = "#FF333";
            }

            xmlChildContent = xmlChildContent + createXmlTextNode(value[3],parentuuid, data, y, 120, 80, fontColor);

            y = y + childYIncrPos;
            childCount = childCount + 1;

            //xmlChildContent = xmlChildContent + connectionXml ;
        });

        if(clsInterfaceObj.uuid !== baseUUID)
        {
            const connectionXML = `\n<mxCell id="${uuidv4()}" value="" style="endArrow=block;endSize=10;endFill=0;shadow=0;strokeWidth=1;rounded=0;curved=0;edgeStyle=elbowEdgeStyle;elbow=vertical;" parent="1" source="${clsInterfaceObj.uuid}" target="${baseUUID}" edge="1">
            <mxGeometry width="160" relative="1" as="geometry">
            <mxPoint x="${nodeXPos}" y="${nodeYPos}" as="sourcePoint" />
            <mxPoint x="${nodeXPos}" y="${nodeYPos - (childCount *80)}" as="targetPoint" />
            </mxGeometry>
            </mxCell>`;
            //getBaseClassConnectionXml(parentuuid,clsInterfaceObj.base, fileObjMap);
            if(connectionXML)
            {
                xmlConnections.push(connectionXML);
            }

            
        }else
        {
            //set the y pos of derived class below the base class
            nodeYPos = nodeYPos + (childCount * 80);
        }

        let h = childYIncrPos * (childCount + 1);
        let valueFormatted = formatValueToXml(clsInterfaceObj.name);

        xmlClassContent = xmlClassContent + createXmlListNode(parentuuid, valueFormatted, nodeXPos, nodeYPos, 160, h);
        
        xmlClassContent = xmlClassContent + xmlChildContent;

        syncWriteFile(path, xmlClassContent); // Writing content to file

    }
    catch(error)
    {
        console.error('Error appending class XML data:', error);
    }

}


// function appendClassXmlDataHeader(fileObjMap: Map<string, Map<string, classInterface>>, path: string, xmlConnections: string[]) 
// {
//     console.log("started executing appendClassXmlDataHeader ....");
//     try 
//     {
//         let modifiers = new Map([
//             ['private', '-'],
//             ['protected', '#'],
//             ['declaration', '+']
//         ]);

        
        
//         let data : string = "";
//         let nodeXPos = 0;
        
//         let baseNodeXPos = 0;
//         fileObjMap.forEach((clsObjMap, filePath)=>{   
//             let xmlClassContent = "";
//             nodeXPos = nodeXPos + 200;
    
//             let nodeYPos = 600;
//             let baseNodeYPos = 0;
//             console.log(`Reading src : ${filePath} symbols.`);
//             clsObjMap.forEach((value, className) => {
//                 console.log(`Reading class : ${className}.`);
//                 let y               = 26;
//                 let parentuuid      = value.uuid;
//                 let baseCls         = value.base;
//                 let childCount      = 0;
//                 let xmlChildContent = "";
//                 const childYIncrPos = 26;

//                 value.funcs.forEach(async (value, functionName) => {
//                     const formattedValue = formatValueToXml(functionName);
//                     let data = modifiers.get(value[0]) + formattedValue;
//                     let fname = functionName.split("(")[0];

//                     const connectionXml = getConnectionXml(className, fname, value[3], fileObjMap, filePath);
                    
//                     let fontColor: string = "";
//                    if (connectionXML === " "){
//                        fontColor = "#FF333";
//                    }

//                    xmlChildContent = xmlChildContent + createXmlTextNode(value[3],parentuuid, data, y, 120, 80, fontColor);

//                     y = y + childYIncrPos;
//                     childCount = childCount + 1;

//                     //xmlChildContent = xmlChildContent + connectionXml ;
//                 });

//                 let h = childYIncrPos * (childCount + 1);
//                 let valueFormatted = formatValueToXml(value.name);

            
//                 xmlClassContent = xmlClassContent + createXmlListNode(parentuuid, valueFormatted, nodeXPos, nodeYPos, 160, h);
                
//                 xmlClassContent = xmlClassContent + xmlChildContent;

//                 nodeYPos = nodeYPos + (childCount * 80);

//                 const connectionXML = getBaseClassConnectionXml(parentuuid, baseCls, fileObjMap);
//                 if(connectionXML)
//                 {
//                     xmlConnections.push(connectionXML);
//                 }

               
//             });

           
            
//             syncWriteFile(path, xmlClassContent); // Writing content to file
//         });
//     } catch (error) {
//         //console.error('Error appending class XML data:', error);
//     }

//     console.log("end executing appendClassXmlDataHeader ....");
// }

function getXmlHeaderContent()
{
    let uuid = uuidv4();
    let xmlHeaderContent = `<mxfile host="app.diagrams.net" modified="2024-03-15T04:23:59.069Z" agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36" version="24.0.2" etag="aks6HkVxmZ68ohly_puq" type="device">
        <diagram id="${uuid}" name="Page-1">
        <mxGraphModel dx="2074" dy="1016" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
        <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />`;

    return xmlHeaderContent;
}

function createXmlTextNode(uuid: string, parentuuid:string, data: string, ypos: number, width: number,height: number, fontColor: string)
{
    if(fontColor !== "")
    {
        return `\n<mxCell id= "${uuid}" value="${data}" style="text;fontColor:${fontColor};strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="${parentuuid}">
            <mxGeometry y="${ypos}" width="${width}" height="${height}" as="geometry"/>
            </mxCell>`;    
    }
    else
    {
        return `\n<mxCell id= "${uuid}" value="${data}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="${parentuuid}">
                    <mxGeometry y="${ypos}" width="${width}" height="${height}" as="geometry"/>
                    </mxCell>`;    
    }
}

function createXmlListNode(uuid: string, data: string, xpos: number, ypos: number, width: number,height: number)
{
    
    return `\n<mxCell id ="${uuid}" value="${data}" style="swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;" vertex="1" parent="1">
                    <mxGeometry x="${xpos}" y="${ypos}" width="${width}" height="${height}" as="geometry"/>
                    </mxCell>`;
}

// Function to find pairs of similar file names
function findSimilarPairs(headerFiles : vscode.Uri[], sourceFiles: vscode.Uri[]) {
    const pairs = [];

    // Iterate over header files
    for (const headerFile of headerFiles) {
        const headerFileName = headerFile.fsPath.split('/').pop(); // Extract filename from path

        // Find source file with similar name
        const similarSourceFile = sourceFiles.find(sourceFile => {
            const sourceFileName = sourceFile.fsPath.split('/').pop(); // Extract filename from path
            return sourceFileName?.replace('.cpp', '') === headerFileName?.replace('.h', '');
        });

        // If a similar source file is found, create a pair
        if (similarSourceFile) {
            pairs.push([headerFile, similarSourceFile]);
        }
    }

    return pairs;
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    const fileObjMap = new Map<string, Map<string, classInterface> >();
   
    const pathtosave = join(getFileSaveLocation(), `jigsaw_headers.drawio` );
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "outliner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('gathersymbol.helloWorld', async () => {
    
        const headerfiles = await vscode.workspace.findFiles('**/*.h'); 
        const sourcefiles = await vscode.workspace.findFiles('**/*.cpp'); 

        const header_source_pair = findSimilarPairs(headerfiles, sourcefiles);

        //console.log(`pair: ${header_source_pair}`);
        
        let xmlFooterContent = ` 
            </root>
            </mxGraphModel>
            </diagram>
            </mxfile>`;
    
        let xmlClassContent = "";
        let xmlConnections : string[] = [];

        for( const pair of header_source_pair)
        {
            const document = await vscode.workspace.openTextDocument(pair[0]);
            const filePath  = document.fileName as string;
            const fileNameWithoutExtension = basename(filePath, extname(filePath));
            const fileWithoutSlotsKey = ReplaceQtSlots(document, getFileSaveLocation());
        
            console.log(getFunctionList(fileWithoutSlotsKey));

            const symbolsPromiseFromHeaders = await getFunctionList(fileWithoutSlotsKey);
            const symbolsPromiseFromSource = await getFunctionList(pair[1]);
        
            readSymbols(pair[0].path, pair[1].path, symbolsPromiseFromHeaders as vscode.DocumentSymbol[], symbolsPromiseFromSource as vscode.DocumentSymbol[], sourcefiles, fileObjMap);

            //Check if the file exists
            if (fs.existsSync((fileWithoutSlotsKey).path)) {
            // Delete the file
                fs.unlinkSync((fileWithoutSlotsKey).path);
                //console.log('File deleted successfully.');
            } else {
                //console.log('File does not exist.');
            }
        }

        syncWriteFile(pathtosave, getXmlHeaderContent());
        appendClassXmlDataHeader(fileObjMap, pathtosave, xmlConnections);
        
        for(const xml of xmlConnections)
        {
            fs.appendFileSync(pathtosave, xml);
        }
        syncWriteFile(pathtosave, xmlFooterContent);
	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}


