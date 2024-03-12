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
exports.deactivate = exports.writeSymbolsToFile = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const fs_1 = require("fs");
const path_1 = require("path");
// Async function to fetch employee data
async function getFunctionList(uri) {
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
    (0, fs_1.writeFileSync)(filename, data, {
        flag: 'a+',
    });
    //const contents = readFileSync(filename, 'utf-8');
    //return contents;
}
function readSymbolsRecursivly(symbol, clsObject, clsname, pathtosave) {
    console.log(`symbol: ${symbol}`);
    if (symbol.kind == 4) {
        clsname = symbol.name;
        if (!clsObject.has(symbol.name)) {
            var object = { name: clsname, attribs: new Map(), funcs: new Map() };
            clsObject.set(clsname, object);
        }
        let data = clsname + "\n";
        //syncWriteFile(pathtosave, data);
    }
    if (symbol.kind == 7) {
        if (clsObject.has(clsname)) {
            clsObject.get(clsname)?.attribs.set(symbol.name, symbol.detail);
        }
        ;
        let data = "";
        if (symbol.detail == "private") {
            data = data + "- ";
        }
        else if (symbol.detail == "protected") {
            data = data + "# ";
        }
        else {
            data = data + "+ ";
        }
        data = data + symbol.name + "\n";
        //syncWriteFile(pathtosave, data);
    }
    if (symbol.kind == 5) {
        if (clsObject.has(clsname)) {
            clsObject.get(clsname)?.funcs.set(symbol.name, symbol.detail);
        }
        let data = "";
        if (symbol.detail == "private") {
            data = data + "- ";
        }
        else if (symbol.detail == "protected") {
            data = data + "# ";
        }
        else {
            data = data + "+ ";
        }
        data = data + symbol.name + "\n";
        //syncWriteFile(pathtosave, data);
    }
    for (const child of symbol.children) {
        readSymbolsRecursivly(child, clsObject, clsname, pathtosave);
    }
}
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
        var fs = require('fs');
        var dir = '/user_data/drawio';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (fs.existsSync(dir)) {
            console.log(`created ${dir}`);
        }
        const headerfiles = await vscode.workspace.findFiles('**/*.h');
        //const pathtosave = join("/user_data/globalClassDiagram.txt");
        for (const file of headerfiles) {
            clsObjectMap.clear();
            const document = await vscode.workspace.openTextDocument(file);
            //var active = vscode.window.activeTextEditor;
            let filePath = document.fileName;
            const fileNameWithoutExtension = (0, path_1.basename)(filePath, (0, path_1.extname)(filePath));
            const pathtosave = (0, path_1.join)(dir, `${fileNameWithoutExtension}.txt`);
            //console.log(getFunctionList());
            const symbolsPromise = getFunctionList(document.uri);
            if (symbolsPromise) {
                const symbols = await symbolsPromise;
                for (const symbol of symbols) {
                    readSymbolsRecursivly(symbol, clsObjectMap, symbol.name, pathtosave);
                }
                let data;
                // // Iterate over the map using forEach
                clsObjectMap.forEach((value, key) => {
                    syncWriteFile(pathtosave, "\n\n" + value.name);
                    value.attribs.forEach((value, key) => {
                        let data = "";
                        if (value == "private") {
                            data = data + "\n-";
                        }
                        else if (value == "protected") {
                            data = data + "\n#";
                        }
                        else {
                            data = data + "\n+";
                        }
                        data = data + key;
                        //syncWriteFile(pathtosave, data);
                        //syncWriteFile(pathtosave, "--\n");
                    });
                    value.funcs.forEach((value, key) => {
                        let data = "";
                        if (value == "private") {
                            data = data + "\n-";
                        }
                        else if (value == "protected") {
                            data = data + "\n#";
                        }
                        else {
                            data = data + "\n+";
                        }
                        data = data + key;
                        syncWriteFile(pathtosave, data);
                    });
                });
            }
        }
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