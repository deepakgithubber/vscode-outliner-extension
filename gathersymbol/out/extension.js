"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path_1 = require("path");
const uuid_1 = require("uuid");
const child_process_1 = require("child_process");
// Async function to fetch employee data
async function getFunctionList(uri) {
    return await new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri));
        }, 1000);
    });
}
function syncWriteFile(filename, data) {
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
function readSymbolsRecursivlyFromHeader(headerfile, symbol, srcSymbols, srcfiles, clsObject, clsname) {
    if (symbol.kind === vscode.SymbolKind.Class) {
        const data = readInheritance(headerfile).toString();
        const lines = data.toString().split("\n");
        const map = new Map();
        for (const line of lines) {
            const [key, value] = line.split(" ");
            if (key && value) {
                map.set(key, value);
            }
        }
        clsname = symbol.name;
        if (!clsObject.has(symbol.name)) {
            let basecls = "Global";
            if (map.has(clsname)) {
                basecls = map.get(clsname);
                console.log(`classname : ${clsname} base: ${basecls}`);
                if (!basecls || (basecls.trim().length === 0) || basecls.startsWith('Q')) {
                    basecls = "Global";
                }
            }
            var object = { uuid: (0, uuid_1.v4)(), name: clsname, attribs: new Map(), funcs: new Map(), base: basecls };
            clsObject.set(clsname, object);
        }
    }
    if (symbol.kind === vscode.SymbolKind.Method || symbol.kind === vscode.SymbolKind.Function || symbol.kind === vscode.SymbolKind.Module) {
        if (clsObject.has(clsname)) {
            let details = symbol.detail.split(",");
            let fname = symbol.name.split("(")[0];
            let uuid = (0, uuid_1.v4)();
            let line = searchSymbolRecursivelyInSource(srcSymbols, symbol);
            let metadata = [details[0], line, "None", uuid];
            clsObject.get(clsname)?.funcs.set(symbol.name, metadata);
            searchTextInFilesSync(fname, srcfiles);
        }
    }
    for (const child of symbol.children) {
        readSymbolsRecursivlyFromHeader(headerfile, child, srcSymbols, srcfiles, clsObject, clsname);
    }
}
// Function to read a file asynchronously
async function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
// Function to write to a file asynchronously
async function writeFileAsync(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, 'utf8', (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
function ReplaceQtSlots(document, pathtosave) {
    try {
        const filedata = fs.readFileSync(document.fileName);
        var result = filedata.toString().replace(/public slots:/g, 'public:');
        let filePath = document.fileName;
        let newfilePath = (0, path_1.join)(pathtosave, (0, path_1.basename)(filePath));
        fs.writeFileSync(newfilePath, result);
        return vscode.Uri.file(newfilePath);
    }
    catch (error) {
        //console.error('Error updating file:', error);
        return document.uri;
    }
}
function searchTextInFilesSync(searchString, sourcefiles) {
    let visited = new Set();
    let result = "";
    const searchPromises = sourcefiles.map(async (src) => {
        const directoryPath = vscode.Uri.joinPath(src, '..').fsPath;
        if (!visited.has(directoryPath)) {
            const command = `grep -rn "${searchString}" ${directoryPath}`;
            //setTimeout(() => {
            (0, child_process_1.exec)(command, (error, stdout, stderr) => {
                if (error) {
                    //console.log(`Error executing command: ${error.message}`);
                }
                else if (stderr) {
                    //console.log(`Command encountered an error: ${stderr}`);
                }
                else {
                    fs.appendFileSync((0, path_1.join)(getFileSaveLocation(true), `${searchString}.txt`), stdout);
                }
            });
            visited.add(directoryPath);
        }
    });
}
// Function to read a file asynchronously
async function searchTextInFiles(searchString, sourcefiles) {
    return new Promise((resolve, reject) => {
        let visited = new Set();
        let result = "";
        const searchPromises = sourcefiles.map(async (src) => {
            const directoryPath = vscode.Uri.joinPath(src, '..').fsPath;
            if (!visited.has(directoryPath)) {
                const command = `grep -rn "${searchString}" ${directoryPath}`;
                //setTimeout(() => {
                (0, child_process_1.exec)(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(`Error executing command: ${error.message}`);
                    }
                    else if (stderr) {
                        reject(`Command encountered an error: ${stderr}`);
                    }
                    else {
                        fs.appendFile((0, path_1.join)(getFileSaveLocation(true), `${searchString}.txt`), stdout, function (err) {
                            if (err) {
                                throw err;
                            }
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
function formatValueToXml(key) {
    let result = key.replace(/&/g, '&amp;');
    if (key.includes('<')) {
        result = result.replace(/</g, '&lt;');
        result = result.replace(/>/g, '&gt;');
    }
    return result;
}
function getFileSaveLocation(temp = false) {
    let dir = "";
    if (fs.existsSync("/user_data")) {
        dir = '/user_data/drawio';
    }
    else {
        //user defined path
        dir = "/Users/deepakthapliyal/Workspace/drawio";
    }
    if (temp) {
        dir = (0, path_1.join)(dir, "temp");
    }
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}
function searchSymbolRecursivelyInSource(symbols, searchSymbol) {
    for (const symbol of symbols) {
        if (symbol.name === searchSymbol.name) {
            return symbol.range.start.line + 1;
        }
        searchSymbolRecursivelyInSource(symbol.children, searchSymbol);
    }
    return -1;
}
function getBaseClassConnectionXml(uuid, baseClass, fileObjMap) {
    let resultXml = "";
    fileObjMap.forEach((value, key) => {
        let filename = key;
        let clssMap = value;
        clssMap.forEach((value, key) => {
            if (key === baseClass) {
                resultXml = `\n<mxCell id="${(0, uuid_1.v4)()}" value="" style="endArrow=block;endSize=10;endFill=0;shadow=0;strokeWidth=1;rounded=0;curved=0;edgeStyle=elbowEdgeStyle;elbow=vertical;" parent="1" source="${uuid}" target="${value.uuid}" edge="1">
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
function getConnectionXml(cls, functionName, sourceUUID, fileObjMap, path) {
    const filePath = (0, path_1.join)(getFileSaveLocation(true), `${functionName}.txt`);
    if (!fs.existsSync(filePath)) {
        return;
    }
    let searchResult = fs.readFileSync(filePath);
    let foundFiles = searchResult.toString().split('\n');
    let foundModuleAtLine = Number.MAX_SAFE_INTEGER;
    let targetUUID = "";
    for (const file of foundFiles) {
        if (file === path) {
            continue;
        }
        const metadata = file.split(':');
        const filePath = metadata[0];
        const foundAtLine = metadata[1];
        if (foundAtLine === "undefined") {
            continue;
        }
        if (fileObjMap.has(filePath)) {
            let clsInterfaceObj = fileObjMap.get(filePath);
            clsInterfaceObj?.forEach((value, key) => {
                if (key !== cls) {
                    value.funcs.forEach(async (value, key) => {
                        let moduleAtLine = value[1];
                        if (moduleAtLine < parseInt(foundAtLine)) {
                            if (foundModuleAtLine > moduleAtLine) {
                                foundModuleAtLine = moduleAtLine;
                                targetUUID = value[3];
                            }
                        }
                    });
                }
            });
        }
        else {
            //console.log(`map does not have the key : `, filePath);
        }
    }
    //console.log(`source id : ${sourceUUID} target id : ${targetUUID}`);
    let xml = "";
    if (targetUUID) {
        let uuid = (0, uuid_1.v4)();
        let xml = `\n<mxCell id="${uuid}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="${sourceUUID}" target="${targetUUID}">
            <mxGeometry relative="1" as="geometry" />
            </mxCell>`;
    }
    return xml;
}
function readInheritance(file) {
    const cmd = `grep -E 'class [A-Za-z0-9_]+ : [A-Za-z0-9_]+|class [A-Za-z0-9_]+ : [A-Za-z0-9_]+[ ]*[,{]' ${file} | awk '{print $2, $5}'`;
    return (0, child_process_1.execSync)(cmd);
    //console.log(executeCommand(cmd));
}
function readSymbols(headerfile, srcfile, symbolsFromHeader, symbolsFromSource, srcfiles, fileObjMap) {
    //console.log(`readSymbols : source file : ${srcfile}`);
    const clsObjectMap = new Map();
    if (symbolsFromHeader) {
        for (const Symbol of symbolsFromHeader) {
            readSymbolsRecursivlyFromHeader(headerfile, Symbol, symbolsFromSource, srcfiles, clsObjectMap, Symbol.name);
        }
        if (!fileObjMap.has(srcfile)) {
            fileObjMap.set(srcfile, clsObjectMap);
        }
    }
}
function appendClassXmlDataHeader(fileObjMap, path, xmlConnections) {
    console.log("started executing appendClassXmlDataHeader ....");
    let classHierarchyMap = new Map();
    let data = "";
    fileObjMap.forEach((clsObjMap, filePath) => {
        clsObjMap.forEach((clsInterfaceObj, className) => {
            if (!classHierarchyMap.has(clsInterfaceObj.base)) {
                classHierarchyMap.set(clsInterfaceObj.base, [clsInterfaceObj]);
            }
            else {
                classHierarchyMap.get(clsInterfaceObj.base)?.push(clsInterfaceObj);
            }
        });
    });
    let nodeXPos = 0;
    const textNodeHeight = 35;
    let maxAttribCount = -1;
    if (classHierarchyMap.has("Global")) {
        let baseClassInterfaceArray = classHierarchyMap.get("Global");
        for (const baseClassInterfaceObj of baseClassInterfaceArray) {
            let nodeYPos = 50;
            console.log(`Base: ${baseClassInterfaceObj.name}`);
            console.log(`Base Node y pos: ${nodeYPos}`);
            const attribCounts = appendClassXmlDataHeaderUtil(baseClassInterfaceObj, fileObjMap, path, baseClassInterfaceObj.uuid, nodeXPos, nodeYPos);
            if (classHierarchyMap.has(baseClassInterfaceObj.name)) {
                let derivedClasses = classHierarchyMap.get(baseClassInterfaceObj.name);
                nodeYPos = nodeYPos + (attribCounts * textNodeHeight);
                nodeYPos = nodeYPos < 0 ? -nodeXPos : nodeYPos;
                console.log(`derived Node y pos: ${nodeYPos}`);
                if (derivedClasses.length) {
                    for (const derived of derivedClasses) {
                        //set the y pos of derived class below the base class
                        console.log(`Drawing derived : ${derived.name}`);
                        appendClassXmlDataHeaderUtil(derived, fileObjMap, path, baseClassInterfaceObj.uuid, nodeXPos, nodeYPos);
                        xmlConnections.push(createBaseDerivedConnectionXml(derived.uuid, baseClassInterfaceObj.uuid, nodeXPos, nodeYPos, textNodeHeight, maxAttribCount));
                        nodeXPos = nodeXPos + 350;
                    }
                }
                else {
                    nodeXPos = nodeXPos + 350;
                }
            }
            else {
                nodeXPos = nodeXPos + 350;
            }
        }
    }
}
function appendClassXmlDataHeaderUtil(clsInterfaceObj, fileObjMap, path, baseUUID, nodeXPos, nodeYPos) {
    try {
        let modifiers = new Map([
            ['private', '-'],
            ['protected', '#'],
            ['declaration', '+']
        ]);
        let y = 26;
        let attribCounts = 0;
        let xmlChildContent = "";
        const childYIncrPos = 26;
        const textNodeHeight = 35;
        let xmlClassContent = "";
        let units = 7;
        clsInterfaceObj.funcs.forEach(async (value, functionName) => {
            const formattedValue = formatValueToXml(functionName);
            let data = modifiers.get(value[0]) + formattedValue;
            let fname = functionName.split("(")[0];
            const connectionXML = getConnectionXml(clsInterfaceObj.name, fname, value[3], fileObjMap, path);
            let fontColor = "";
            if (connectionXML === " ") {
                fontColor = "#FF333";
            }
            xmlChildContent = xmlChildContent + createXmlTextNode(value[3], clsInterfaceObj.uuid, data, y, data.length * units, textNodeHeight, fontColor);
            y = y + childYIncrPos;
            attribCounts = attribCounts + 1;
        });
        let h = childYIncrPos * (attribCounts + 1);
        let valueFormatted = formatValueToXml(clsInterfaceObj.name);
        xmlClassContent = xmlClassContent + createXmlListNode(clsInterfaceObj.uuid, valueFormatted, nodeXPos, nodeYPos, 300, h);
        xmlClassContent = xmlClassContent + xmlChildContent;
        syncWriteFile(path, xmlClassContent); // Writing content to file
        return attribCounts;
    }
    catch (error) {
        console.error('Error appending class XML data:', error);
    }
}
function createBaseDerivedConnectionXml(sourceUUID, targetUUID, nodeXPos, nodeYPos, textNodeHeight, attribCounts) {
    return `\n<mxCell id="${(0, uuid_1.v4)()}" value="" style="endArrow=block;endSize=10;endFill=0;shadow=0;strokeWidth=1;rounded=0;curved=0;edgeStyle=elbowEdgeStyle;elbow=vertical;" parent="1" source="${sourceUUID}" target="${targetUUID}" edge="1">
            <mxGeometry width="160" relative="1" as="geometry">
            <mxPoint x="${nodeXPos}" y="${nodeYPos}" as="sourcePoint" />
            <mxPoint x="${nodeXPos}" y="${nodeYPos - (attribCounts * textNodeHeight)}" as="targetPoint" />
            </mxGeometry>
            </mxCell>`;
}
function getXmlHeaderContent() {
    let uuid = (0, uuid_1.v4)();
    let xmlHeaderContent = `<mxfile host="app.diagrams.net" modified="2024-03-15T04:23:59.069Z" agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36" version="24.0.2" etag="aks6HkVxmZ68ohly_puq" type="device">
        <diagram id="${uuid}" name="Page-1">
        <mxGraphModel dx="2074" dy="1016" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
        <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />`;
    return xmlHeaderContent;
}
function createXmlTextNode(uuid, parentuuid, data, ypos, width, height, fontColor) {
    if (fontColor.trim().length === 0) {
        return `\n<mxCell id= "${uuid}" value="${data}" style="text;fontColor:${fontColor};strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="${parentuuid}">
            <mxGeometry y="${ypos}" width="${width}" height="${height}" as="geometry"/>
            </mxCell>`;
    }
    else {
        return `\n<mxCell id= "${uuid}" value="${data}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="${parentuuid}">
                    <mxGeometry y="${ypos}" width="${width}" height="${height}" as="geometry"/>
                    </mxCell>`;
    }
}
function createXmlListNode(uuid, data, xpos, ypos, width, height) {
    return `\n<mxCell id ="${uuid}" value="${data}" style="swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;" vertex="1" parent="1">
                    <mxGeometry x="${xpos}" y="${ypos}" width="${width}" height="${height}" as="geometry"/>
                    </mxCell>`;
}
// Function to find pairs of similar file names
function findSimilarPairs(headerFiles, sourceFiles) {
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
function activate(context) {
    const fileObjMap = new Map();
    const pathtosave = (0, path_1.join)(getFileSaveLocation(), `dneg-jigsaw.drawio`);
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "outliner" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('gathersymbol.helloWorld', async () => {
        const headerfiles = await vscode.workspace.findFiles('**/*.h');
        const sourcefiles = await vscode.workspace.findFiles('**/*.cpp');
        const pythonfiles = await vscode.workspace.findFiles('**/*.py');
        console.log(`python files: ${pythonfiles}`);
        const header_source_pair = findSimilarPairs(headerfiles, sourcefiles);
        //console.log(`pair: ${header_source_pair}`);
        let xmlFooterContent = ` 
            </root>
            </mxGraphModel>
            </diagram>
            </mxfile>`;
        let xmlClassContent = "";
        let xmlConnections = [];
        let symbolsPromiseFromSource;
        for (const pair of header_source_pair) {
            const document = await vscode.workspace.openTextDocument(pair[0]);
            const filePath = document.fileName;
            const fileNameWithoutExtension = (0, path_1.basename)(filePath, (0, path_1.extname)(filePath));
            const fileWithoutSlotsKey = ReplaceQtSlots(document, getFileSaveLocation());
            console.log(getFunctionList(fileWithoutSlotsKey));
            const symbolsPromiseFromHeaders = await getFunctionList(fileWithoutSlotsKey);
            const symbolsPromiseFromSource = await getFunctionList(pair[1]);
            readSymbols(pair[0].path, pair[1].path, symbolsPromiseFromHeaders, symbolsPromiseFromSource, sourcefiles, fileObjMap);
            //Check if the file exists
            if (fs.existsSync((fileWithoutSlotsKey).path)) {
                // Delete the file
                fs.unlinkSync((fileWithoutSlotsKey).path);
                //console.log('File deleted successfully.');
            }
            else {
                //console.log('File does not exist.');
            }
        }
        for (const file of pythonfiles) {
            const document = await vscode.workspace.openTextDocument(file);
            //const filePath                  = document.fileName as string;
            //const fileNameWithoutExtension  = basename(filePath, extname(filePath));
            //const fileWithoutSlotsKey       = ReplaceQtSlots(document, getFileSaveLocation());
            const symbols = await getFunctionList(document.uri);
            readSymbols(document.uri.path, document.uri.path, symbols, symbols, sourcefiles, fileObjMap);
        }
        syncWriteFile(pathtosave, getXmlHeaderContent());
        appendClassXmlDataHeader(fileObjMap, pathtosave, xmlConnections);
        for (const xml of xmlConnections) {
            fs.appendFileSync(pathtosave, xml);
        }
        syncWriteFile(pathtosave, xmlFooterContent);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map