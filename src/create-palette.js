import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'

const webviewIdentifier = 'sketch-dark-mode.webview'

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

export default () => {
  const windowOptions = {
    identifier: webviewIdentifier,
    width: 460,
    minWidth: 460,
    maxWidth: 740,
    height: 740,
    minHeight: 460,
    maxHeight: 960,
    titleBarStyle: 'hidden',
    show: false
  }

  const browserWindow = new BrowserWindow(windowOptions)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents

  webContents.on('externalLinkClicked', (url) => {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url))
  })

  browserWindow.loadURL(require('../resources/webview.html'))
}
