// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { desktopCapturer } = require('electron')

var captureScreen = () => {
  desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      width: 640,
      height: 480
    }}, (error, sources) => {
    if (error) throw error

    let screenName = document.getElementById('screenName')
    if (sources.length > 0) {
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')
      let img = new Image()
      const size = sources[0].thumbnail.getSize()
      canvas.width = size.width
      canvas.height = size.height

      screenName.textContent = `${sources[0].name}, ${size.width} x ${size.height}, ${img.src.length}`
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = sources[0].thumbnail.toDataURL()
    } else {
      screenName.textContent = 'Nothing captured'
    }
  })
}

document.getElementById('captureScreen').onclick = captureScreen
