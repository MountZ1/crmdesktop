import { app, BrowserWindow } from "electron";
import { server } from "./src/index.js";

const createWindow = () => {
    server();
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
        autoHideMenuBar: true
    });

    win.loadURL("http://localhost:3000");
    win.maximize();
    win.focus();
}

app.whenReady().then(() => {
    createWindow();
})

