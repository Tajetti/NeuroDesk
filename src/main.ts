import { app, BrowserWindow, protocol } from 'electron';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import started from 'electron-squirrel-startup';
import { initializeDatabase } from './database/connection';
import { registerModuleHandler } from './modules/moduleIpc';
import { registerSectionHandler } from './sections/sectionIpc'
import { registerMediaHandlers } from './media/mediaIpc'
import { registerGameHandlers } from './games/gameIpc'

function mediaContentType(fileName: string, destination: string | null) {
  if (fileName.includes('.audio.')) {
    if (fileName.endsWith('.mp3')) return 'audio/mpeg';
    if (fileName.endsWith('.wav')) return 'audio/wav';
    if (fileName.endsWith('.ogg')) return 'audio/ogg';
    return 'audio/webm';
  }
  if (fileName.includes('.video.')) {
    if (fileName.endsWith('.mp4')) return 'video/mp4';
    if (fileName.endsWith('.ogg') || fileName.endsWith('.ogv')) return 'video/ogg';
    return 'video/webm';
  }
  if (fileName.endsWith('.pdf')) return 'application/pdf';
  if (fileName.endsWith('.png')) return 'image/png';
  if (fileName.endsWith('.gif')) return 'image/gif';
  if (fileName.endsWith('.svg')) return 'image/svg+xml';
  if (fileName.endsWith('.webp')) return 'image/webp';
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) return 'image/jpeg';
  if (fileName.endsWith('.webm')) return destination === 'audio' ? 'audio/webm' : 'video/webm';
  return 'application/octet-stream';
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'neurodesk-media',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      stream: true,
    },
  },
]);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  initializeDatabase();
  registerModuleHandler();
  registerSectionHandler();
  registerMediaHandlers();
  registerGameHandlers();
  protocol.handle('neurodesk-media', async (request) => {
    const requestedUrl = new URL(request.url);
    const fileName = path.basename(decodeURIComponent(requestedUrl.pathname));
    const mediaPath = path.join(app.getPath('userData'), 'media', fileName);
    const file = await readFile(mediaPath);
    const range = request.headers.get('range');
    const commonHeaders = {
      'Accept-Ranges': 'bytes',
      'Content-Type': mediaContentType(fileName, request.headers.get('sec-fetch-dest')),
    };

    if (range) {
      const match = /bytes=(\d+)-(\d*)/.exec(range);
      if (match) {
        const start = Number(match[1]);
        const requestedEnd = match[2] ? Number(match[2]) : file.length - 1;
        const end = Math.min(requestedEnd, file.length - 1);
        const chunk = file.subarray(start, end + 1);

        return new Response(new Uint8Array(chunk), {
          status: 206,
          headers: {
            ...commonHeaders,
            'Content-Length': String(chunk.length),
            'Content-Range': `bytes ${start}-${end}/${file.length}`,
          },
        });
      }
    }

    return new Response(new Uint8Array(file), {
      headers: {
        ...commonHeaders,
        'Content-Length': String(file.length),
      },
    });
  });
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
