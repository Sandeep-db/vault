
let dir_folders = []
let restore_folder = ''
let group_name = ''

function displayFolders() {
    $('#folders').empty()
    for (const folder of dir_folders) {
        $('#folders').append(`
            <div class="card-panel folder" oncontextmenu="setRestoreFolder(event, '${folder._id}')">
                <i class="material-icons left">${folder.folder ? 'folder' : 'insert_drive_file'}</i><span>${folder.name}</span>
            </div>
        `)
    }
}

function getTrashFiles(_id) {
    const data = {
        group_id: _id 
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/trash/get-folders',
        headers: {
            token: localStorage.getItem("token"),
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function(data) {
            dir_folders = []
            console.log(data)
            dir_folders = data
            displayFolders()
        },
        error: function(error) {
            alert('something went wrong')
            console.log(error)
        }
    })
}

function restoreFolder() {
    const data = {
        _id: restore_folder
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/trash/restore-folder',
        headers: {
            token: localStorage.getItem("token"),
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function(data) {
            location.reload()
        },
        error: function(error) {
            alert('something went wrong')
            console.log(error)
        }
    })
}


function getGroups() {
    const data = {
        user_id: localStorage.getItem('_id')
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/get-groups',
        headers: {
            token: localStorage.getItem("token"),
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            console.log(data)
            displayGroups(data)
        },
        error: function (error) {
            alert("folder not created")
            console.log(error)
        }
    })
}

function displayGroups(data) {
    $('#groups').empty()
    let gid = localStorage.getItem('group_id')
    if (!gid || gid == localStorage.getItem('_id')) {
        localStorage.setItem('group_id', data[0].group_id)
        localStorage.setItem('group_name', data[0].name)
    }
    for (const group of data) {
        let flag = gid == group._id
        $('#groups').append(`
            <li class="${flag ? 'active' : ''}">
                <a><i class="material-icons" onclick="changeGroup('${group.group_id}', '${group.name}')">inbox</i>${group.name}</a>
            </li>
        `)
    }
}

function changeGroup(group_id, name) {
    localStorage.setItem('group_id', group_id)
    localStorage.setItem('group_name', name)
    location.reload()
}

function setRestoreFolder(event, _id) {
    event.preventDefault()
    restore_folder = _id
    console.log(restore_folder)
    $('#restore-name').modal('open')
}

$(document).ready(function() {
    $('.modal').modal()
    getGroups()
    group_name = localStorage.getItem('group_name')
    $('#group_name').text(group_name)
    getTrashFiles(localStorage.getItem('group_id'))
})
