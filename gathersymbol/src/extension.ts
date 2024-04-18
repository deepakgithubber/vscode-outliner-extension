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
import { clearScreenDown } from 'readline';
import { notDeepEqual } from 'assert';
import { UUID } from 'crypto';
import { start } from 'repl';
import { connect } from 'http2';
import { mode } from 'crypto-js';


interface classInterface
{  
    name: string;
    base: string;
    uuid: string;
    attribs: Map<string, any>;
    funcs: Map<string, [string, number, string, string]>;
    fillColor: string;
    module: string;

    childerens: classInterface[];
}
interface rectInterface
{
    x: number;
    y: number;
    width: number;
    height: number;
}
interface drawioInterface
{
    xml: string;
    attribCount: number; 
}



function findModuleByClass(className: string): string | undefined {

    let pyQt5Data: Map<string, string[]> = new Map<string, string[]>() ;

    pyQt5Data.set('PyQt5.QtCore',['QAbstractAnimation', 'QAbstractEventDispatcher', 'QAbstractItemModel', 'QAbstractListModel', 'QAbstractProxyModel', 'QAbstractState', 'QAbstractTableModel', 'QAbstractTransition', 'QAnimationGroup', 'QIODevice', 'QBuffer', 'QChildEvent', 'QConcatenateTablesProxyModel', 'QCoreApplication', 'QDynamicPropertyChangeEvent', 'QEventLoop', 'QEventTransition', 'QFileDevice', 'QFile', 'QFileSelector', 'QFileSystemWatcher', 'QFinalState', 'QHistoryState', 'QIdentityProxyModel', 'QItemSelectionModel', 'QLibrary', 'QMimeData', 'QObjectCleanupHandler', 'QParallelAnimationGroup', 'QPauseAnimation', 'QPluginLoader', 'QProcess', 'QVariantAnimation', 'QPropertyAnimation', 'QSaveFile', 'QSequentialAnimationGroup', 'QSettings', 'QSharedMemory', 'QSignalMapper', 'QSignalTransition', 'QSocketNotifier', 'QSortFilterProxyModel', 'QState', 'QStateMachine', 'QStringListModel', 'QTemporaryFile', 'QThread', 'QThreadPool', 'QTimeLine', 'QTimer', 'QTimerEvent', 'QTranslator', 'QTransposeProxyModel']);
    pyQt5Data.set('PyQt5.QtWidgets', ['QAbstractButton', 'QAbstractGraphicsShapeItem', 'QFrame', 'QAbstractScrollArea', 'QAbstractItemView', 'QAbstractSlider', 'QAbstractSpinBox', 'QLayout', 'QBoxLayout', 'QCalendarWidget', 'QCheckBox', 'QDialog', 'QColorDialog', 'QColumnView', 'QComboBox', 'QPushButton', 'QCommandLinkButton', 'QCommonStyle', 'QDateTimeEdit', 'QDateEdit', 'QDesktopWidget', 'QDial', 'QDialogButtonBox', 'QDockWidget', 'QDoubleSpinBox', 'QErrorMessage', 'QFileDialog', 'QFocusFrame', 'QFontComboBox', 'QFontDialog', 'QFormLayout', 'QGraphicsLayout', 'QGraphicsAnchorLayout', 'QGraphicsBlurEffect', 'QGraphicsColorizeEffect', 'QGraphicsDropShadowEffect', 'QGraphicsEllipseItem', 'QGraphicsGridLayout', 'QGraphicsItemGroup', 'QGraphicsLineItem', 'QGraphicsLinearLayout', 'QGraphicsObject', 'QGraphicsOpacityEffect', 'QGraphicsPathItem', 'QGraphicsPixmapItem', 'QGraphicsPolygonItem', 'QGraphicsWidget', 'QGraphicsWidget', 'QGraphicsProxyWidget', 'QGraphicsRectItem', 'QGraphicsRotation', 'QGraphicsScale', 'QGraphicsSceneContextMenuEvent', 'QGraphicsSceneDragDropEvent', 'QGraphicsSceneHelpEvent', 'QGraphicsSceneHoverEvent', 'QGraphicsSceneMouseEvent', 'QGraphicsSceneMoveEvent', 'QGraphicsSceneResizeEvent', 'QGraphicsSceneWheelEvent', 'QGraphicsSimpleTextItem', 'QGraphicsTextItem', 'QGraphicsView', 'QGridLayout', 'QGroupBox', 'QHBoxLayout', 'QHeaderView', 'QInputDialog', 'QItemDelegate', 'QKeySequenceEdit', 'QLCDNumber', 'QLabel', 'QLineEdit', 'QListView', 'QListWidget', 'QMacCocoaViewContainer', 'QMainWindow', 'QMdiArea', 'QMdiSubWindow', 'QMenu', 'QMenuBar', 'QMessageBox', 'QOpenGLWidget', 'QPanGesture', 'QPinchGesture', 'QPlainTextEdit', 'QProgressBar', 'QProgressDialog', 'QProxyStyle', 'QRadioButton', 'QRubberBand', 'QScrollArea', 'QScrollBar', 'QSizeGrip', 'QSlider', 'QSpacerItem', 'QSpinBox', 'QSplashScreen', 'QSplitter', 'QSplitterHandle', 'QStackedLayout', 'QStackedWidget', 'QStatusBar', 'QStyleHintReturnMask', 'QStyleHintReturnVariant', 'QStyleOptionButton', 'QStyleOptionComplex', 'QStyleOptionComboBox', 'QStyleOptionDockWidget', 'QStyleOptionFocusRect', 'QStyleOptionFrame', 'QStyleOptionGraphicsItem', 'QStyleOptionGroupBox', 'QStyleOptionHeader', 'QStyleOptionMenuItem', 'QStyleOptionProgressBar', 'QStyleOptionRubberBand', 'QStyleOptionSizeGrip', 'QStyleOptionSlider', 'QStyleOptionSpinBox', 'QStyleOptionTab', 'QStyleOptionTabBarBase', 'QStyleOptionTabV4', 'QStyleOptionTabWidgetFrame', 'QStyleOptionTitleBar', 'QStyleOptionToolBar', 'QStyleOptionToolBox', 'QStyleOptionToolButton', 'QStyleOptionViewItem', 'QStyledItemDelegate', 'QSwipeGesture', 'QTabBar', 'QTabWidget', 'QTableView', 'QTableWidget', 'QTapAndHoldGesture', 'QTapGesture', 'QTextEdit', 'QTextBrowser', 'QTimeEdit', 'QToolBar', 'QToolBox', 'QToolButton', 'QTreeView', 'QTreeWidget', 'QUndoView', 'QVBoxLayout', 'QWidgetAction', 'QWidgetItem', 'QWizard', 'QWizardPage']);
    pyQt5Data.set('PyQt5.QtNetwork',['QNetworkDiskCache', 'QTcpSocket', 'QSslSocket', 'QUdpSocket']);
    pyQt5Data.set('PyQt5.QtPrintSupport',['QPrintDialog']);
    pyQt5Data.set('PyQt5.QtSql',['QSqlIndex', 'QSqlTableModel', 'QSqlRelationalTableModel']);
    pyQt5Data.set('PyQt5.QtXml',['QDomAttr', 'QDomCharacterData', 'QDomText', 'QDomCDATASection', 'QDomComment', 'QDomDocument', 'QDomDocumentFragment', 'QDomDocumentType', 'QDomElement', 'QDomEntity', 'QDomEntityReference', 'QDomNotation', 'QDomProcessingInstruction', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlDefaultHandler', 'QXmlSimpleReader']);


    let result = "Core";
    pyQt5Data.forEach((qtClasses, module) =>{
        console.log(qtClasses);
        for (const qtClass of qtClasses)
        {
            console.log(`findModuleByClass : cls ${className} qtClass ${qtClass} module ${module}`);
            if (className === qtClass)
            {
                result  = module;
            }
        }
       
    });

    return result;
}

// Async function to fetch employee data
async function getFunctionList(uri: vscode.Uri){
    return await new Promise((resolve, reject) => {
        setTimeout(function(){
            resolve(vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider',uri));
        }, 1000);
    });
    
}

function syncWriteFile(filename: string, data: any, mode = 'a+') {
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

function readSymbolsRecursivlyFromHeader(headerfile: string, symbol: vscode.DocumentSymbol, srcSymbols:vscode.DocumentSymbol[] , srcfiles: vscode.Uri[],clsObject: Map<string, classInterface>, clsname: string)
{ 
   
    let containersMap = new Map<string, any>();

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

        clsname = symbol.name;
        if(!clsObject.has(symbol.name))
        {
            let basecls: string     = "Global";
            let fillcolor:string    = "#FFFFFF";
            let module:string       = "Core";

            if(map.has(clsname))
            {
                basecls = map.get(clsname) as string;
                if(basecls.startsWith('Q'))
                {
                    module = gatherQtAPIModuleName(basecls) as string;
                    console.log(`cls name ${basecls} module ${module}`);
                    fillcolor="#FF0000";
                    
                }
                if(!basecls || (basecls.trim().length === 0) || basecls.startsWith('Q'))
                {
                    basecls = "Global";
                }
            }   

            var object:  classInterface = {uuid: uuidv4(), name : clsname, attribs:new Map<string, any>(), funcs : new Map<string,any>(), base: basecls, fillColor: fillcolor, module: module, childerens:[]};
            clsObject.set(clsname, object);
        }
    }
    if (symbol.kind === vscode.SymbolKind.Method || symbol.kind === vscode.SymbolKind.Function || symbol.kind === vscode.SymbolKind.Module)
    {
        if (clsObject.has(clsname))
        {
            let details = symbol.detail.split(",");
            let fname   = symbol.name.split("(")[0];
            let uuid    = uuidv4();


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
                const command = `grep -rnw "${searchString}" ${directoryPath}`;
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
    if(!fs.existsSync(filePath)) {return 0 ;}

    let searchResult = fs.readFileSync(filePath);

    if (searchResult)
    {
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

function readInheritance(file: string) 
{
    const cmd = `grep -E 'class [A-Za-z0-9_]+ : [A-Za-z0-9_]+|class [A-Za-z0-9_]+ : [A-Za-z0-9_]+[ ]*[,{]' ${file} | awk '{print $2, $5}'`;
    return execSync(cmd);
    //console.log(executeCommand(cmd));
}


// Function to recursively read header file symbols and extract class inheritance
async function readHeaderSymbols(headerFiles: vscode.Uri[]): Promise<Map<string, string[]>> {
    const classMap: Map<string, string[]> = new Map();

    // Recursive function to process document symbols
    async function processSymbols(uri: vscode.Uri, baseClass: string | null = null) {
        const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', uri);
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
                        classMap.get(baseClass)!.push(className);
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

function readSymbols(headerfile: string, srcfile: string, symbolsFromHeader: vscode.DocumentSymbol[], symbolsFromSource: vscode.DocumentSymbol[],srcfiles: vscode.Uri[],fileObjMap: Map<string, Map<string, classInterface>>)
{

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
     //console.log("started executing appendClassXmlDataHeader ....");
     let classHierarchyMap   = new Map<string, classInterface[]>();
     let containersMap       = new Map<string, string>();
     let visited = new Map<string, boolean>();
 
     let data: string                = "";
     let nodeXPos: number            = 0;
     const textNodeHeight: number    = 35;
     let maxAttribCount: number      = -1;
     
    fileObjMap.forEach((clsObjMap, filePath)=>
    {   
        clsObjMap.forEach((clsInterfaceObj, className) => {
            if(!classHierarchyMap.has(clsInterfaceObj.module))
            {
                classHierarchyMap.set(clsInterfaceObj.module, [clsInterfaceObj]);
            }else{

                classHierarchyMap.get(clsInterfaceObj.module)?.push(clsInterfaceObj);
            }
        });
    });

    console.log(`number of modules: ${Object.keys(classHierarchyMap).length}`);

    classHierarchyMap.forEach((classInterfaceArray, module)=>{

      
        let containerXPos       = 50;
        let containerYPos       = 50;
       
        let xOffset     :number   = 100;
        let yOffset     :number   = 100;
        let cellWidth  :number   = 300;
        let cellHeight  :number   = 300;
        let x           :number   = xOffset;
        let y           :number   = yOffset;

        let x_containerOffset:number   = 100;
        let y_containerOffset:number   = 100;

        let numRows = Math.ceil(Math.sqrt(classInterfaceArray.length)); // Round up to ensure all items fit
        let numCols = Math.ceil(classInterfaceArray.length / numRows);

        let classBlocks:string[] = [];

        console.log(`####processing module: ${module}####`);

        let containerUUID       = uuidv4();

        let row = 0;
        let col = 0;

        for(const classInterfaceObj of classInterfaceArray)
        {

            console.log(`####processing class: ${classInterfaceObj.name} with module : ${classInterfaceObj.module}####`);

            let child_x = x + (col * (cellWidth + xOffset));
            let child_y = y + (row * (cellHeight + yOffset));

            let data  = appendClassXmlDataHeaderUtil(classInterfaceObj, 
                fileObjMap, 
                path, 
                child_x,
                child_y,
                containerUUID) as drawioInterface;
            

            col = col + 1;
            if(col > numCols)
            {
                col = 0;
                row = row + 1;
            }

            

            classBlocks.push(data.xml);
        }

        syncWriteFile(path,getContainerXml(module, containerUUID, containerXPos, containerYPos, (numCols * cellWidth) + x_containerOffset, (numRows* cellHeight) + y_containerOffset));
        containerXPos = containerXPos + 100;

        for( const xml of classBlocks)
        { 
            syncWriteFile(path, xml);
        }
    });
 
}


function appendClassXmlDataHeaderUtil(clsInterfaceObj: classInterface, fileObjMap: Map<string, Map<string, classInterface>>, path: string, nodex: number, nodey: number, puuid: string)
{
    try 
    {
        let modifiers = new Map([
            ['private', '-'],
            ['protected', '#'],
            ['declaration', '+']
        ]);

        let y_offset            = 26;
        const textNodeHeight    = 35;
        let attribCounts        = 0;
        let xmlChildContent     = "";
        let xmlClassContent     = "";
        let units               = 7;

        let y = y_offset;
    
       
        let classModuleMap = new Map<string,string>();
        clsInterfaceObj.funcs.forEach(async (value, functionName) => {
            const formattedValue = formatValueToXml(functionName);
            let data: string  = "";
            if(modifiers.has(value[0])){
                data = modifiers.get(value[0]) + formattedValue;
            }else{
                data = formattedValue;
            }
            let fname = functionName.split("(")[0];
           
            const foundAtLines = getConnectionXml(clsInterfaceObj.name, fname, value[3], fileObjMap, path) as number;
            let fontColor: string = "";
            
            if (foundAtLines === 0){
                fontColor = "#FF0000";
            }

            xmlChildContent = xmlChildContent + createXmlTextNode(value[3], clsInterfaceObj.uuid, data, y, data.length * units, textNodeHeight, fontColor);
            y = y + y_offset;
            attribCounts = attribCounts + 1;

        });

        let h               = y_offset * (attribCounts + 1);
        let valueFormatted  = formatValueToXml(clsInterfaceObj.name);
        xmlClassContent     = xmlClassContent + createXmlListNode(clsInterfaceObj, valueFormatted, nodex, nodey, 300, h, puuid);
        xmlClassContent     = xmlClassContent + xmlChildContent;

        //syncWriteFile(path, xmlClassContent); // Writing content to file
        let data: drawioInterface = {xml: xmlClassContent, attribCount: attribCounts};
        return data;
    }
    catch(error)
    {
        console.error('Error appending class XML data:', error);
    }
}

function createBaseDerivedConnectionXml(sourceUUID: string, targetUUID: string, nodeXPos: number, nodeYPos: number, textNodeHeight: number, attribCounts: number)
{
    return `\n<mxCell id="${uuidv4()}" value="" style="endArrow=block;endSize=10;endFill=0;shadow=0;strokeWidth=1;rounded=0;curved=0;edgeStyle=elbowEdgeStyle;elbow=vertical;" parent="1" source="${sourceUUID}" target="${targetUUID}" edge="1">
            <mxGeometry width="160" relative="1" as="geometry">
            <mxPoint x="${nodeXPos}" y="${nodeYPos}" as="sourcePoint" />
            <mxPoint x="${nodeXPos}" y="${nodeYPos - (attribCounts * textNodeHeight)}" as="targetPoint" />
            </mxGeometry>
            </mxCell>`;
}

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
    if(fontColor.trim().length === 0)
    {
        return `\n<mxCell id= "${uuid}" value="${data}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;" vertex="1" parent="${parentuuid}">
            <mxGeometry y="${ypos}" width="${width}" height="${height}" as="geometry"/>
            </mxCell>`;    
    }
  
    return `\n<mxCell id= "${uuid}" value="${data}" style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;fontColor=${fontColor};" vertex="1" parent="${parentuuid}">
                <mxGeometry y="${ypos}" width="${width}" height="${height}" as="geometry"/>
                </mxCell>`;    
    
}

function createXmlListNode(obj:classInterface,data: string, xpos: number, ypos: number, width: number,height: number, container: string)
{
    
    return `\n<mxCell id ="${obj.uuid}" value="${data}" style="swimlane;fontStyle=1;fillColor=${obj.fillColor};childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;" vertex="1" parent="${container}">
                    <mxGeometry x="${xpos}" y="${ypos}" width="${width}" height="${height}" as="geometry"/>
                    </mxCell>`;
}

function getContainerXml(name: string, uuid: string, xpos: number, ypos: number, width: number,height: number)
{
    return `\n<mxCell id= "${uuid}" value="${name}" style="swimlane:startsize=0;" vertex="1" parent="1">
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
   
    const pathtosave = join(getFileSaveLocation(), `dneg-jigsaw.drawio` );

    //console.log(`module : ${findModuleByClass('QLineEdit')}`);
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
        let xmlConnections : string[] = [];
        let symbolsPromiseFromSource : vscode.DocumentSymbol[];
        for( const pair of header_source_pair)
        {
            const document = await vscode.workspace.openTextDocument(pair[0]);
            const filePath  = document.fileName as string;
            const fileNameWithoutExtension = basename(filePath, extname(filePath));
            const fileWithoutSlotsKey = ReplaceQtSlots(document, getFileSaveLocation());
        
           // console.log(getFunctionList(fileWithoutSlotsKey));

            const symbolsPromiseFromHeaders = await getFunctionList(fileWithoutSlotsKey);
            const symbolsPromiseFromSource = await getFunctionList(pair[1]);
        
            readHeaderSymbols(headerfiles).then(clssInheritanceMap =>{
                console.log(clssInheritanceMap);
            });
            
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

        // for( const file of pythonfiles)
        // {
        //     const document                  = await vscode.workspace.openTextDocument(file);
        //     const symbols = await getFunctionList(document.uri) as vscode.DocumentSymbol[];
        //     readSymbols(document.uri.path, document.uri.path, symbols as vscode.DocumentSymbol[], symbols as vscode.DocumentSymbol[], sourcefiles, fileObjMap);
        // }

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

function getModulePythonScript()
{
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

function  gatherQtAPIModuleName(cls: string)
{
    return findModuleByClass(cls);
}

// This method is called when your extension is deactivated
export function deactivate() {}
