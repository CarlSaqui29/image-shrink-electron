// destructuring
// app -> manages the entire life cycle of application
// BrowserWindow -> is a class used to create desktop windows
// Menu is for upper menu of window
// globalSHortcut is for 
const { app, BrowserWindow, Menu, globalShortcut} = require('electron');

// know what is the env (development, production) and know what OS
// if packaging the app will set this to production
process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;

const createMainWindow = () => {
  // initializing desktop window
  mainWindow = new BrowserWindow({
    title: 'Image Shrink Application',
    width: 500,
    height: 600,
    icon: './assets/icons/Icon_256x256.png'
  })

  // load the mainWindow of your choice
  mainWindow.loadFile('./src/index.html')
}

const createAboutWindow = () => {
  // initializing desktop window
  aboutWindow = new BrowserWindow({
    title: 'Image Shrink Application',
    width: 300 ,
    height: 300,
    resizable: false,
    icon: './assets/icons/Icon_256x256.png'
  })

  // load the mainWindow of your choice
  aboutWindow.loadFile('./src/about.html')
}

// display window
app.on('ready', () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // for dev shorcuts
  globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload());
  globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools());

  // garbage collection
  mainWindow.on('closed', () => mainWindow = null);
});

const menu = [
  ...(isMac 
    ? [
    { 
      label: app.name,
      submenu: [ {
        label: 'About',
        click: createAboutWindow,
        },  
      ] 
    }] : []),
  ...(!isMac 
    ? [
    { 
      label: 'Help',
      submenu: [ {
        label: 'About',
        click: createAboutWindow,
        },  
      ] 
    }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev ? 
  [
    {
      label: 'Developer',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'separator' },
        { role: 'toggledevtools' },
      ]
    }
  ]: [])
]

// quit when all windows closed
app.on('window-all-closed', () => {
  // stay active until the user quits explicitly with Cmd + Q
  if (isMac) { app.quit };
})

app.on('activate', () => {
  // create  a window in the app when the app on
  // dock is click and there is no windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
})