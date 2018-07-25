// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const electron = require('electron')
const { desktopCapturer } = require('electron')
const $ = require('jquery')

var captureScreens = () => {
  const screenNames = document.getElementById('screenNames')
  const screenInfo = document.getElementById('screenInfo')
  const canvas = document.getElementById('thumbnailCanvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 0
  canvas.height = 0
  screenNames.textContent = ''
  screenInfo.textContent = ''
  $('#screenVideos').empty()
  desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: 320,
      height: 240
    }}, (error, sources) => {
    if (error) console.error(error)

    sources.forEach((source) => {
      const img = new Image()
      const size = source.thumbnail.getSize()
      canvas.width += size.width
      canvas.height = Math.max(canvas.height, size.height)

      screenNames.textContent += `${source.id}, ${source.display_id} (${source.name}) | `
      const dx = canvas.width - size.width
      img.onload = () => ctx.drawImage(img, dx, 0)
      img.src = source.thumbnail.toDataURL()

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: source.id,
            minWidth: 640,
            maxWidth: 640,
            minHeight: 320,
            maxHeight: 320
          }
        }
      })
      .then((stream) => {
        const screenVideos = document.getElementById('screenVideos')
        const video = document.createElement('video')
        screenVideos.appendChild(video)
        video.srcObject = stream
        video.onloadedmetadata = () => {
          video.play()
        }
      })
      .catch((error) => console.error(error))
    })
    const displays = electron.screen.getAllDisplays()
    displays.forEach((display) => {
      const size = display.size
      screenInfo.textContent += `${display.id} (${size.width} x ${size.height}), `
    })
  })
}

document.getElementById('captureScreens').onclick = captureScreens
