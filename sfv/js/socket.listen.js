
function listenFileStatus() {
    var socket = io('http://0.0.0.0:4000');
    socket.emit('connected', localStorage.getItem('_id'))
    socket.on('transfer', obj => {
        console.log('transfer: ', obj)
    })
    socket.on('transferComplete', () => {
        console.log('transfer complete')
    })
    socket.on('upload', obj => {
        console.log('upload: ', obj)
    })
    socket.on('finish', obj => {
        console.log('finish: ', obj)
    })
}

$(document).ready(function () {
    listenFileStatus()
    document.onload = listenFileStatus
    document.onblur = listenFileStatus
})