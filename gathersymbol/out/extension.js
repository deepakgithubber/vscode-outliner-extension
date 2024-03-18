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
exports.deactivate = exports.writeSymbolsToFile = exports.activate = exports.ReplaceQtSlots = exports.writeFileAsync = exports.readFileAsync = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path_1 = require("path");
const uuid_1 = require("uuid");
// Async function to fetch employee data
async function getFunctionList(uri) {
    console.log(`getFunctionList : ${uri}`);
    if (vscode.window.activeTextEditor) {
        var active = vscode.window.activeTextEditor;
        return await new Promise((resolve, reject) => {
            setTimeout(function () {
                resolve(vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri));
            }, 1000);
        });
    }
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
function readSymbolsRecursivly(symbol, clsObject, clsname) {
    if (symbol.kind == vscode.SymbolKind.Class) {
        clsname = symbol.name;
        if (!clsObject.has(symbol.name)) {
            var object = { name: clsname, attribs: new Map(), funcs: new Map() };
            clsObject.set(clsname, object);
        }
    }
    if (symbol.kind == vscode.SymbolKind.Method || symbol.kind == vscode.SymbolKind.Function || symbol.kind == vscode.SymbolKind.Module) {
        if (clsObject.has(clsname)) {
            let details = symbol.detail.split(",");
            console.log(`symbol: ${symbol.name} class: ${clsname} details: ${details[0]}`);
            clsObject.get(clsname)?.funcs.set(symbol.name, details[0]);
        }
    }
    for (const child of symbol.children) {
        readSymbolsRecursivly(child, clsObject, clsname);
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
exports.readFileAsync = readFileAsync;
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
exports.writeFileAsync = writeFileAsync;
function createDrawioXml(outputFile) {
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
async function ReplaceQtSlots(document, pathtosave) {
    try {
        const filedata = await readFileAsync(document.fileName);
        var result = filedata.replace(/public slots:/g, 'public:');
        let filePath = document.fileName;
        let newfilePath = (0, path_1.join)(pathtosave, (0, path_1.basename)(filePath));
        await writeFileAsync(newfilePath, result);
        return vscode.Uri.file(newfilePath);
    }
    catch (error) {
        console.error('Error updating file:', error);
        return document.uri;
    }
}
exports.ReplaceQtSlots = ReplaceQtSlots;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
async function activate(context) {
    const clsObjectMap = new Map();
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "outliner" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('gathersymbol.helloWorld', async () => {
        console.log("Current directory:", __dirname);
        var dir = '/Users/deepakthapliyal/Workspace/drawio';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (fs.existsSync(dir)) {
            console.log(`created ${dir}`);
        }
        const headerfiles = await vscode.workspace.findFiles('**/*.h');
        let uuid = (0, uuid_1.v4)();
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
        const pathtosave = (0, path_1.join)(dir, `jigsaw_headers.drawio`);
        for (const file of headerfiles) 
        //if (vscode.window.activeTextEditor) 
        {
            clsObjectMap.clear();
            //const document = vscode.window.activeTextEditor.document;
            const document = await vscode.workspace.openTextDocument(file);
            let filePath = document.fileName;
            const fileNameWithoutExtension = (0, path_1.basename)(filePath, (0, path_1.extname)(filePath));
            //const pathtosave = join(dir, `${fileNameWithoutExtension}.xml` );
            //console.log(getFunctionList(document.uri));
            //At presennt symbols does not add slots as class childrens, 
            //hence removing slots keyword and then read the file.
            let uri = ReplaceQtSlots(document, dir);
            const symbolsPromise = getFunctionList(await uri);
            if (symbolsPromise) {
                const symbols = await symbolsPromise;
                for (const symbol of symbols) {
                    readSymbolsRecursivly(symbol, clsObjectMap, symbol.name);
                }
                let data;
                // Iterate over the map using forEach
                clsObjectMap.forEach((value, key) => {
                    // Generate a v4 UUID (random)
                    let uuid_parent = (0, uuid_1.v4)();
                    let childYPos = 26;
                    let childCount = 0;
                    //syncWriteFile(pathtosave, xmlContent);
                    let xmlChildContent = "";
                    value.attribs.forEach((value, key) => {
                        let data = "";
                        if (value == "private") {
                            data = data + "-";
                        }
                        else if (value == "protected") {
                            data = data + "#";
                        }
                        else {
                            data = data + "+";
                        }
                        data = data + key;
                        //syncWriteFile(pathtosave, data);
                        //syncWriteFile(pathtosave, "--\n");
                    });
                    let y = childYPos;
                    let width = 120;
                    let height = 80;
                    value.funcs.forEach((value, key) => {
                        let data = "";
                        if (value == "private") {
                            data = data + "-";
                        }
                        else if (value == "protected") {
                            data = data + "#";
                        }
                        else {
                            data = data + "+";
                        }
                        key = key.replace(/&/g, '&amp;');
                        key = key.replace(/</g, '&lt;');
                        key = key.replace(/</g, '&gt;');
                        data = data + key;
                        let uuid_child = (0, uuid_1.v4)();
                        xmlChildContent = xmlChildContent + `\n<mxCell id= "${uuid_child}" value="${data}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="${uuid_parent}">
                        <mxGeometry y="${y}" width="120" height="80" as="geometry"/>
                        </mxCell>`;
                        y = y + childYPos;
                        childCount = childCount + 1;
                    });
                    let h = childYPos * (childCount + 1);
                    xmlClassContent = xmlClassContent + `\n<mxCell id ="${uuid_parent}" value="${value.name}" style="swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;" vertex="1" parent="1">
                    <mxGeometry x="${groupXPos}" y="300" width="160" height="${h}" as="geometry"/>
                    </mxCell>`;
                    xmlClassContent = xmlClassContent + xmlChildContent;
                    groupXPos = groupXPos + 200;
                });
            }
            //Check if the file exists
            if (fs.existsSync((await uri).fsPath)) {
                // Delete the file
                fs.unlinkSync((await uri).fsPath);
                console.log('File deleted successfully.');
            }
            else {
                console.log('File does not exist.');
            }
        }
        let xmlContent = xmlHeaderContent + xmlClassContent + xmlFooterContent;
        syncWriteFile(pathtosave, xmlContent);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
async function writeSymbolsToFile(symbolMap) {
}
exports.writeSymbolsToFile = writeSymbolsToFile;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map