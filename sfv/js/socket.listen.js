
function listenFileStatus() {
    var socket = io('http://0.0.0.0:4000');
    socket.emit('connected', localStorage.getItem('group_id'))
    socket.on('transfer', obj => {
        $('.progress-transfer').show()
        $('.upload-file-button').hide()
        $('.transfer-value').text(obj.progress)
        $('#tranfer-bar').css('width', obj.progress + '%')
        console.log('transfer: ', obj)
    })
    socket.on('transferComplete', () => {
        console.log('transfer complete')
        location.href = 'status.html'
    })
    socket.on('upload', obj => {
        $('.upload-value').text(obj.progress)
        $('#upload-bar').css('width', obj.progress + '%')
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