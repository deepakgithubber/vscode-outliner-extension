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
let pyQt5Data = new Map();
pyQt5Data.set('PyQt5.QtCore', ['QAbstractAnimation', 'QAbstractEventDispatcher', 'QAbstractItemModel', 'QAbstractListModel', 'QAbstractProxyModel', 'QAbstractState', 'QAbstractTableModel', 'QAbstractTransition', 'QAnimationGroup', 'QIODevice', 'QBuffer', 'QChildEvent', 'QConcatenateTablesProxyModel', 'QCoreApplication', 'QDynamicPropertyChangeEvent', 'QEventLoop', 'QEventTransition', 'QFileDevice', 'QFile', 'QFileSelector', 'QFileSystemWatcher', 'QFinalState', 'QHistoryState', 'QIdentityProxyModel', 'QItemSelectionModel', 'QLibrary', 'QMimeData', 'QObjectCleanupHandler', 'QParallelAnimationGroup', 'QPauseAnimation', 'QPluginLoader', 'QProcess', 'QVariantAnimation', 'QPropertyAnimation', 'QSaveFile', 'QSequentialAnimationGroup', 'QSettings', 'QSharedMemory', 'QSignalMapper', 'QSignalTransition', 'QSocketNotifier', 'QSortFilterProxyModel', 'QState', 'QStateMachine', 'QStringListModel', 'QTemporaryFile', 'QThread', 'QThreadPool', 'QTimeLine', 'QTimer', 'QTimerEvent', 'QTranslator', 'QTransposeProxyModel']);
pyQt5Data.set('PyQt5.QtWidgets', ['QAbstractButton', 'QAbstractGraphicsShapeItem', 'QFrame', 'QAbstractScrollArea', 'QAbstractItemView', 'QAbstractSlider', 'QAbstractSpinBox', 'QLayout', 'QBoxLayout', 'QCalendarWidget', 'QCheckBox', 'QDialog', 'QColorDialog', 'QColumnView', 'QComboBox', 'QPushButton', 'QCommandLinkButton', 'QCommonStyle', 'QDateTimeEdit', 'QDateEdit', 'QDesktopWidget', 'QDial', 'QDialogButtonBox', 'QDockWidget', 'QDoubleSpinBox', 'QErrorMessage', 'QFileDialog', 'QFocusFrame', 'QFontComboBox', 'QFontDialog', 'QFormLayout', 'QGraphicsLayout', 'QGraphicsAnchorLayout', 'QGraphicsBlurEffect', 'QGraphicsColorizeEffect', 'QGraphicsDropShadowEffect', 'QGraphicsEllipseItem', 'QGraphicsGridLayout', 'QGraphicsItemGroup', 'QGraphicsLineItem', 'QGraphicsLinearLayout', 'QGraphicsObject', 'QGraphicsOpacityEffect', 'QGraphicsPathItem', 'QGraphicsPixmapItem', 'QGraphicsPolygonItem', 'QGraphicsWidget', 'QGraphicsWidget', 'QGraphicsProxyWidget', 'QGraphicsRectItem', 'QGraphicsRotation', 'QGraphicsScale', 'QGraphicsSceneContextMenuEvent', 'QGraphicsSceneDragDropEvent', 'QGraphicsSceneHelpEvent', 'QGraphicsSceneHoverEvent', 'QGraphicsSceneMouseEvent', 'QGraphicsSceneMoveEvent', 'QGraphicsSceneResizeEvent', 'QGraphicsSceneWheelEvent', 'QGraphicsSimpleTextItem', 'QGraphicsTextItem', 'QGraphicsView', 'QGridLayout', 'QGroupBox', 'QHBoxLayout', 'QHeaderView', 'QInputDialog', 'QItemDelegate', 'QKeySequenceEdit', 'QLCDNumber', 'QLabel', 'QLineEdit', 'QListView', 'QListWidget', 'QMacCocoaViewContainer', 'QMainWindow', 'QMdiArea', 'QMdiSubWindow', 'QMenu', 'QMenuBar', 'QMessageBox', 'QOpenGLWidget', 'QPanGesture', 'QPinchGesture', 'QPlainTextEdit', 'QProgressBar', 'QProgressDialog', 'QProxyStyle', 'QRadioButton', 'QRubberBand', 'QScrollArea', 'QScrollBar', 'QSizeGrip', 'QSlider', 'QSpacerItem', 'QSpinBox', 'QSplashScreen', 'QSplitter', 'QSplitterHandle', 'QStackedLayout', 'QStackedWidget', 'QStatusBar', 'QStyleHintReturnMask', 'QStyleHintReturnVariant', 'QStyleOptionButton', 'QStyleOptionComplex', 'QStyleOptionComboBox', 'QStyleOptionDockWidget', 'QStyleOptionFocusRect', 'QStyleOptionFrame', 'QStyleOptionGraphicsItem', 'QStyleOptionGroupBox', 'QStyleOptionHeader', 'QStyleOptionMenuItem', 'QStyleOptionProgressBar', 'QStyleOptionRubberBand', 'QStyleOptionSizeGrip', 'QStyleOptionSlider', 'QStyleOptionSpinBox', 'QStyleOptionTab', 'QStyleOptionTabBarBase', 'QStyleOptionTabV4', 'QStyleOptionTabWidgetFrame', 'QStyleOptionTitleBar', 'QStyleOptionToolBar', 'QStyleOptionToolBox', 'QStyleOptionToolButton', 'QStyleOptionViewItem', 'QStyledItemDelegate', 'QSwipeGesture', 'QTabBar', 'QTabWidget', 'QTableView', 'QTableWidget', 'QTapAndHoldGesture', 'QTapGesture', 'QTextEdit', 'QTextBrowser', 'QTimeEdit', 'QToolBar', 'QToolBox', 'QToolButton', 'QTreeView', 'QTreeWidget', 'QUndoView', 'QVBoxLayout', 'QWidgetAction', 'QWidgetItem', 'QWizard', 'QWizardPage']);
pyQt5Data.set('PyQt5.QtNetwork', ['QNetworkDiskCache', 'QTcpSocket', 'QSslSocket', 'QUdpSocket']);
pyQt5Data.set('PyQt5.QtPrintSupport', ['QPrintDialog']);
pyQt5Data.set('PyQt5.QtSql', ['QSqlIndex', 'QSqlTableModel', 'QSqlRelationalTableModel']);
pyQt5Data.set('PyQt5.QtXml', ['QDomAttr', 'QDomCharacterData', 'QDomText', 'QDomCDATASection', 'QDomComment', 'QDomDocument', 'QDomDocumentFragment', 'QDomDocumentType', 'QDomElement', 'QDomEntity', 'QDomEntityReference', 'QDomNotation', 'QDomProcessingInstruction', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlSimpleReader']);
function findModuleByClass(className) {
    for (const moduleName in pyQt5Data) {
        if (pyQt5Data.hasOwnProperty(moduleName)) {
            const classes = pyQt5Data.get(moduleName);
            if (classes.includes(className)) {
                return moduleName;
            }
        }
    }
    return undefined;
}
// Async function to fetch employee data
async function getFunctionList(uri) {
    return await new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri));
        }, 1000);
    });
}
function syncWriteFile(filename, data, mode = 'a+') {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    fs.writeFileSync(filename, data, {
        flag: mode,
    });
    //const contents = readFileSync(filename, 'utf-8');
    //return contents;
}
function readSymbolsRecursivlyFromHeader(headerfile, symbol, srcSymbols, srcfiles, clsObject, clsname) {
    let containersMap = new Map();
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
            let fillcolor = "#FFFFFF";
            let module = "Core";
            if (map.has(clsname)) {
                basecls = map.get(clsname);
                if (basecls.startsWith('Q')) {
                    module = gatherQtAPIModuleName(clsname);
                    console.log(`cls name ${clsname} module ${module}`);
                    fillcolor = "#FF0000";
                }
                if (!basecls || (basecls.trim().length === 0) || basecls.startsWith('Q')) {
                    basecls = "Global";
                }
            }
            var object = { uuid: (0, uuid_1.v4)(), name: clsname, attribs: new Map(), funcs: new Map(), base: basecls, fillColor: fillcolor, module: module, childerens: [] };
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
                const command = `grep -rnw "${searchString}" ${directoryPath}`;
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
        return 0;
    }
    let searchResult = fs.readFileSync(filePath);
    if (searchResult) {
        let foundFiles = searchResult.toString().split('\n');
        return foundFiles.length;
    }
    return 0;
    /*let foundModuleAtLine : number = Number.MAX_SAFE_INTEGER;
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
    */
}
function readInheritance(file) {
    const cmd = `grep -E 'class [A-Za-z0-9_]+ : [A-Za-z0-9_]+|class [A-Za-z0-9_]+ : [A-Za-z0-9_]+[ ]*[,{]' ${file} | awk '{print $2, $5}'`;
    return (0, child_process_1.execSync)(cmd);
    //console.log(executeCommand(cmd));
}
// Function to recursively read header file symbols and extract class inheritance
async function readHeaderSymbols(headerFiles) {
    const classMap = new Map();
    // Recursive function to process document symbols
    async function processSymbols(uri, baseClass = null) {
        const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', uri);
        if (symbols) {
            for (const symbol of symbols) {
                if (symbol.kind === vscode.SymbolKind.Class) {
                    // Extract class name
                    const className = symbol.name;
                    // Update class map with inheritance relationship
                    if (baseClass) {
                        if (!classMap.has(baseClass)) {
                            classMap.set(baseClass, []);
                        }
                        classMap.get(baseClass).push(className);
                    }
                    // Recursively process children symbols
                    await processSymbols(uri, className);
                }
            }
        }
    }
    // Iterate over each header file
    for (const headerFile of headerFiles) {
        await processSymbols(headerFile);
    }
    return classMap;
}
function readSymbols(headerfile, srcfile, symbolsFromHeader, symbolsFromSource, srcfiles, fileObjMap) {
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
    //console.log("started executing appendClassXmlDataHeader ....");
    let classHierarchyMap = new Map();
    let containersMap = new Map();
    let visited = new Map();
    let data = "";
    let nodeXPos = 0;
    const textNodeHeight = 35;
    let maxAttribCount = -1;
    fileObjMap.forEach((clsObjMap, filePath) => {
        clsObjMap.forEach((clsInterfaceObj, className) => {
            if (!classHierarchyMap.has(clsInterfaceObj.module)) {
                classHierarchyMap.set(clsInterfaceObj.module, [clsInterfaceObj]);
            }
            else {
                classHierarchyMap.get(clsInterfaceObj.module)?.push(clsInterfaceObj);
            }
        });
    });
    console.log(`number of modules: ${Object.keys(classHierarchyMap).length}`);
    classHierarchyMap.forEach((classInterfaceArray, module) => {
        let containerXPos = 50;
        let containerYPos = 50;
        let xOffset = 100;
        let yOffset = 100;
        let cellWidth = 300;
        let cellHeight = 300;
        let x = xOffset;
        let y = yOffset;
        let x_containerOffset = 100;
        let y_containerOffset = 100;
        let numRows = Math.ceil(Math.sqrt(classInterfaceArray.length)); // Round up to ensure all items fit
        let numCols = Math.ceil(classInterfaceArray.length / numRows);
        let classBlocks = [];
        console.log(`####processing module: ${module}####`);
        let containerUUID = (0, uuid_1.v4)();
        let row = 0;
        let col = 0;
        for (const classInterfaceObj of classInterfaceArray) {
            console.log(`####processing class: ${classInterfaceObj.name} with module : ${classInterfaceObj.module}####`);
            let child_x = x + (col * (cellWidth + xOffset));
            let child_y = y + (row * (cellHeight + yOffset));
            let data = appendClassXmlDataHeaderUtil(classInterfaceObj, fileObjMap, path, child_x, child_y, containerUUID);
            col = col + 1;
            if (col > numCols) {
                col = 0;
                row = row + 1;
            }
            classBlocks.push(data.xml);
        }
        syncWriteFile(path, getContainerXml(module, containerUUID, containerXPos, containerYPos, (numCols * cellWidth) + x_containerOffset, (numRows * cellHeight) + y_containerOffset));
        containerXPos = containerXPos + 100;
        for (const xml of classBlocks) {
            syncWriteFile(path, xml);
        }
    });
}
function appendClassXmlDataHeaderUtil(clsInterfaceObj, fileObjMap, path, nodex, nodey, puuid) {
    try {
        let modifiers = new Map([
            ['private', '-'],
            ['protected', '#'],
            ['declaration', '+']
        ]);
        let y_offset = 26;
        const textNodeHeight = 35;
        let attribCounts = 0;
        let xmlChildContent = "";
        let xmlClassContent = "";
        let units = 7;
        let y = y_offset;
        let classModuleMap = new Map();
        clsInterfaceObj.funcs.forEach(async (value, functionName) => {
            const formattedValue = formatValueToXml(functionName);
            let data = "";
            if (modifiers.has(value[0])) {
                data = modifiers.get(value[0]) + formattedValue;
            }
            else {
                data = formattedValue;
            }
            let fname = functionName.split("(")[0];
            const foundAtLines = getConnectionXml(clsInterfaceObj.name, fname, value[3], fileObjMap, path);
            let fontColor = "";
            if (foundAtLines === 0) {
                fontColor = "#FF0000";
            }
            xmlChildContent = xmlChildContent + createXmlTextNode(value[3], clsInterfaceObj.uuid, data, y, data.length * units, textNodeHeight, fontColor);
            y = y + y_offset;
            attribCounts = attribCounts + 1;
        });
        let h = y_offset * (attribCounts + 1);
        let valueFormatted = formatValueToXml(clsInterfaceObj.name);
        xmlClassContent = xmlClassContent + createXmlListNode(clsInterfaceObj, valueFormatted, nodex, nodey, 300, h, puuid);
        xmlClassContent = xmlClassContent + xmlChildContent;
        //syncWriteFile(path, xmlClassContent); // Writing content to file
        let data = { xml: xmlClassContent, attribCount: attribCounts };
        return data;
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
        return `\n<mxCell id= "${uuid}" value="${data}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="${parentuuid}">
            <mxGeometry y="${ypos}" width="${width}" height="${height}" as="geometry"/>
            </mxCell>`;
    }
    return `\n<mxCell id= "${uuid}" value="${data}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontColor=${fontColor};" vertex="1" parent="${parentuuid}">
                <mxGeometry y="${ypos}" width="${width}" height="${height}" as="geometry"/>
                </mxCell>`;
}
function createXmlListNode(obj, data, xpos, ypos, width, height, container) {
    return `\n<mxCell id ="${obj.uuid}" value="${data}" style="swimlane;fontStyle=1;fillColor=${obj.fillColor};childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;" vertex="1" parent="${container}">
                    <mxGeometry x="${xpos}" y="${ypos}" width="${width}" height="${height}" as="geometry"/>
                    </mxCell>`;
}
function getContainerXml(name, uuid, xpos, ypos, width, height) {
    return `\n<mxCell id= "${uuid}" value="${name}" style="swimlane:startsize=0;" vertex="1" parent="1">
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
        //console.log(`python files: ${pythonfiles}`);
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
            // console.log(getFunctionList(fileWithoutSlotsKey));
            const symbolsPromiseFromHeaders = await getFunctionList(fileWithoutSlotsKey);
            const symbolsPromiseFromSource = await getFunctionList(pair[1]);
            readHeaderSymbols(headerfiles).then(clssInheritanceMap => {
                console.log(clssInheritanceMap);
            });
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
        // for( const file of pythonfiles)
        // {
        //     const document                  = await vscode.workspace.openTextDocument(file);
        //     const symbols = await getFunctionList(document.uri) as vscode.DocumentSymbol[];
        //     readSymbols(document.uri.path, document.uri.path, symbols as vscode.DocumentSymbol[], symbols as vscode.DocumentSymbol[], sourcefiles, fileObjMap);
        // }
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
function getModulePythonScript() {
    return `
import inspect
import sys


modulelist  = {'PyQt5.QtCore': ['QAbstractAnimation', 'QAbstractEventDispatcher', 'QAbstractItemModel', 'QAbstractListModel', 'QAbstractProxyModel', 'QAbstractState', 'QAbstractTableModel', 'QAbstractTransition', 'QAnimationGroup', 'QIODevice', 'QBuffer', 'QChildEvent', 'QConcatenateTablesProxyModel', 'QCoreApplication', 'QDynamicPropertyChangeEvent', 'QEventLoop', 'QEventTransition', 'QFileDevice', 'QFile', 'QFileSelector', 'QFileSystemWatcher', 'QFinalState', 'QHistoryState', 'QIdentityProxyModel', 'QItemSelectionModel', 'QLibrary', 'QMimeData', 'QObjectCleanupHandler', 'QParallelAnimationGroup', 'QPauseAnimation', 'QPluginLoader', 'QProcess', 'QVariantAnimation', 'QPropertyAnimation', 'QSaveFile', 'QSequentialAnimationGroup', 'QSettings', 'QSharedMemory', 'QSignalMapper', 'QSignalTransition', 'QSocketNotifier', 'QSortFilterProxyModel', 'QState', 'QStateMachine', 'QStringListModel', 'QTemporaryFile', 'QThread', 'QThreadPool', 'QTimeLine', 'QTimer', 'QTimerEvent', 'QTranslator', 'QTransposeProxyModel'], 'PyQt5.QtWidgets': ['QAbstractButton', 'QAbstractGraphicsShapeItem', 'QFrame', 'QAbstractScrollArea', 'QAbstractItemView', 'QAbstractSlider', 'QAbstractSpinBox', 'QLayout', 'QBoxLayout', 'QCalendarWidget', 'QCheckBox', 'QDialog', 'QColorDialog', 'QColumnView', 'QComboBox', 'QPushButton', 'QCommandLinkButton', 'QCommonStyle', 'QDateTimeEdit', 'QDateEdit', 'QDesktopWidget', 'QDial', 'QDialogButtonBox', 'QDockWidget', 'QDoubleSpinBox', 'QErrorMessage', 'QFileDialog', 'QFocusFrame', 'QFontComboBox', 'QFontDialog', 'QFormLayout', 'QGraphicsLayout', 'QGraphicsAnchorLayout', 'QGraphicsBlurEffect', 'QGraphicsColorizeEffect', 'QGraphicsDropShadowEffect', 'QGraphicsEllipseItem', 'QGraphicsGridLayout', 'QGraphicsItemGroup', 'QGraphicsLineItem', 'QGraphicsLinearLayout', 'QGraphicsObject', 'QGraphicsOpacityEffect', 'QGraphicsPathItem', 'QGraphicsPixmapItem', 'QGraphicsPolygonItem', 'QGraphicsWidget', 'QGraphicsWidget', 'QGraphicsProxyWidget', 'QGraphicsRectItem', 'QGraphicsRotation', 'QGraphicsScale', 'QGraphicsSceneContextMenuEvent', 'QGraphicsSceneDragDropEvent', 'QGraphicsSceneHelpEvent', 'QGraphicsSceneHoverEvent', 'QGraphicsSceneMouseEvent', 'QGraphicsSceneMoveEvent', 'QGraphicsSceneResizeEvent', 'QGraphicsSceneWheelEvent', 'QGraphicsSimpleTextItem', 'QGraphicsTextItem', 'QGraphicsView', 'QGridLayout', 'QGroupBox', 'QHBoxLayout', 'QHeaderView', 'QInputDialog', 'QItemDelegate', 'QKeySequenceEdit', 'QLCDNumber', 'QLabel', 'QLineEdit', 'QListView', 'QListWidget', 'QMacCocoaViewContainer', 'QMainWindow', 'QMdiArea', 'QMdiSubWindow', 'QMenu', 'QMenuBar', 'QMessageBox', 'QOpenGLWidget', 'QPanGesture', 'QPinchGesture', 'QPlainTextEdit', 'QProgressBar', 'QProgressDialog', 'QProxyStyle', 'QRadioButton', 'QRubberBand', 'QScrollArea', 'QScrollBar', 'QSizeGrip', 'QSlider', 'QSpacerItem', 'QSpinBox', 'QSplashScreen', 'QSplitter', 'QSplitterHandle', 'QStackedLayout', 'QStackedWidget', 'QStatusBar', 'QStyleHintReturnMask', 'QStyleHintReturnVariant', 'QStyleOptionButton', 'QStyleOptionComplex', 'QStyleOptionComboBox', 'QStyleOptionDockWidget', 'QStyleOptionFocusRect', 'QStyleOptionFrame', 'QStyleOptionGraphicsItem', 'QStyleOptionGroupBox', 'QStyleOptionHeader', 'QStyleOptionMenuItem', 'QStyleOptionProgressBar', 'QStyleOptionRubberBand', 'QStyleOptionSizeGrip', 'QStyleOptionSlider', 'QStyleOptionSpinBox', 'QStyleOptionTab', 'QStyleOptionTabBarBase', 'QStyleOptionTabV4', 'QStyleOptionTabWidgetFrame', 'QStyleOptionTitleBar', 'QStyleOptionToolBar', 'QStyleOptionToolBox', 'QStyleOptionToolButton', 'QStyleOptionViewItem', 'QStyledItemDelegate', 'QSwipeGesture', 'QTabBar', 'QTabWidget', 'QTableView', 'QTableWidget', 'QTapAndHoldGesture', 'QTapGesture', 'QTextEdit', 'QTextBrowser', 'QTimeEdit', 'QToolBar', 'QToolBox', 'QToolButton', 'QTreeView', 'QTreeWidget', 'QUndoView', 'QVBoxLayout', 'QWidgetAction', 'QWidgetItem', 'QWizard', 'QWizardPage'], 'PyQt5.QtNetwork': ['QNetworkDiskCache', 'QTcpSocket', 'QSslSocket', 'QUdpSocket'], 'PyQt5.QtPrintSupport': ['QPrintDialog'], 'PyQt5.QtSql': ['QSqlIndex', 'QSqlTableModel', 'QSqlRelationalTableModel'], 'PyQt5.QtXml': ['QDomAttr', 'QDomCharacterData', 'QDomText', 'QDomCDATASection', 'QDomComment', 'QDomDocument', 'QDomDocumentFragment', 'QDomDocumentType', 'QDomElement', 'QDomEntity', 'QDomEntityReference', 'QDomNotation', 'QDomProcessingInstruction', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlSimpleReader']}



# Create a dictionary to store module-subclass mappings
qt_module_subclasses = {}
# Function to recursively get all subclasses of a module
def get_subclasses(module):
    for name, obj in module.__dict__.items():
        if inspect.isclass(obj) and obj.__module__ == module.__name__:
            # Check if the module name is a key in the dictionary
            qt_module_subclasses.setdefault(module.__name__, []).append(name)
            get_subclasses(obj)
    
# Get subclasses for each Qt module
for module_name in ['PyQt5.QtCore', 'PyQt5.QtWidgets', 'QtNetwork', 'QtPrintSupport', 'QtSql', 'QtSvg', 'QtWebKit', 'QtXml']:
    module = globals().get(module_name)
    if module:
        get_subclasses(module)

args = sys.argv[1:]
    
# Print the dictionary
for module, subclasses in qt_module_subclasses.items():
    for subclass in subclasses:
        if args[0] == subclass:
            f = f.open(os.path.join("/Users/deepakthapliyal/Workspace/drawio/temp", cls + '.txt')
            f.write(module)
            f.close()
            
            print (module, file=sys.stdout)
            break
            
`;
}
function gatherQtAPIModuleName(cls) {
    return findModuleByClass(cls);
    // // Python code to execute
    // const pythonCode = getModulePythonScript();
    // // Arguments to pass to Python code
    // const args = [cls];
    // // Execute Python code using child process
    // let cmd  = `/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -c "${pythonCode}" ${args.map(arg => `"${args}"`).join(' ')}`;
    // //console.log('cmd: ', cmd);
    // exec(cmd, (error, stdout, stderr) => {
    //     if (error) {
    //         //console.error(`Error executing Python: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         //console.error(`Python error: ${stderr}`);
    //         return;
    //     }
    //     console.log(`cls ${cls} : module : ${stdout}`);
    //     //syncWriteFile(join(getFileSaveLocation(true), 'class_' + cls + '.txt'), stdout, 'w');
    //     //console.log(`Python output for cls : ${cls} : ${stdout} written to file.`);
    // });
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map