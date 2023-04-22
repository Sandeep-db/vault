
let path = '/'
let dirs = []
let dir_ids = []
let dir_folders = []
let current_directory = {}

function setpath(path) {
    const data = {
        email: localStorage.getItem("email"),
        path: path
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/set-path',
        headers: {
            token: localStorage.getItem("token"),
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            console.log(data)
            location.reload()
        },
        error: function (error) {
            alert('something went wrong')
            console.log(error)
        }
    })
}

function getPath() {
    const data = {
        email: localStorage.getItem("email")
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/get-path',
        headers: {
            token: localStorage.getItem("token"),
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            path = data.path
            for (const dir of path.split('/')) {
                if (dir) {
                    dirs.push(dir)
                }
            }
            updatePath(dirs.length, false)
            getFiles(path)
        },
        error: function (error) {
            alert('something went wrong in get')
            console.log(error)
        }
    })
}

function createFolder() {
    let folder_name = $('#folder-name').find('input').val()
    const data = {
        user_id: localStorage.getItem('_id'),
        group_id: localStorage.getItem('_id'),
        parent: current_directory._id,
        location: current_directory.location,
        folder_name: folder_name,
        directory: true
    }
    console.log(data)
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/create-folder',
        headers: {
            token: localStorage.getItem("token"),
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            console.log(data)
            location.reload()
        },
        error: function (error) {
            alert("folder not created")
            console.log(error)
        }
    })
}

function getFiles(path) {
    const data = {
        user_id: localStorage.getItem('_id'),
        group_id: localStorage.getItem('_id'),
        location: path
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/get-files',
        headers: {
            token: localStorage.getItem("token"),
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            current_directory = data
            if (!current_directory.directory) {
                location.href = "showfile.html"
                return
            }
            dir_folders = data.children
            console.log(dir_folders)
            displayFolders()
        },
        error: function (error) {
            alert('something went wrong')
            console.log(error)
        }
    })
}

function openFile(url) {
    console.log(url)
}

function displayFolders() {
    $('#folders').empty()
    for (const folder of dir_folders) {
        $('#folders').append(`
            <div class="card-panel folder" onclick="selectFolder('${folder.name}')">
            <i class="material-icons left">folder</i><span>${folder.name}</span>
            </div>
        `)
    }
}

function updatePath(index, flag) {
    dirs.length = index
    path = '/'
    $('.path-header').empty()
    $('.path-header').append('<span class="dir"><i class="material-icons">keyboard_arrow_right</i><a class="path-nav" onclick="updatePath(0, true)">Home</a></span>')
    for (let [i, dir] of dirs.entries()) {
        $('.path-header').append(`<span class="dir"><i class="material-icons">keyboard_arrow_right</i><a class="path-nav" onclick="updatePath(${i + 1}, true)">${dir}</a></span>`)
        path += dir + '/'
    }
    flag && setpath(path)
}

function selectFolder(name) {
    let folder_name = name || $(this).find('span').text()
    dirs.push(folder_name)
    let x = dirs.length
    $('.path-header').append(`<span class="dir"><i class="material-icons">keyboard_arrow_right</i><a class="path-nav" onclick="updatePath(${x}, true)">${folder_name}</a></span>`)
    path += folder_name + '/'
    setpath(path)
}

function uploadFile(file) {
    const formData = new FormData();
    let data = {
        user_id: localStorage.getItem('_id'),
        group_id: localStorage.getItem('_id'),
        parent: current_directory._id,
        location: current_directory.location
    }
    formData.append(JSON.stringify(data), file)
    $.ajax({
        url: 'http://127.0.0.1:3000/upload',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('success: ', response)
        },
        error: function (xhr, status, error) {
            console.error('error: ', error)
        }
    })
}

$(document).ready(function () {
    getPath()
    $('.folder').on('click', selectFolder)
    $('.modal').modal()
    $('#fileupload').on('submit', function (e) {
        e.preventDefault()
        const file = $('#upload-file')[0].files[0];
        uploadFile(file)
    })
})