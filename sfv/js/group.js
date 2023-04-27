

let path = '/'
let dirs = []
let dir_ids = []
let dir_folders = []
let current_directory = {}
let delete_folder = ''

function setpath(path) {
    const data = {
        email: localStorage.getItem("email"),
        group_id: localStorage.getItem("group_id"),
        path: path
        
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/group/set-path',
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
        email: localStorage.getItem("email"),
        group_id: localStorage.getItem("group_id"),
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/group/get-path',
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
        group_id: localStorage.getItem('group_id'),
        parent: current_directory._id,
        location: current_directory.location,
        folder_name: folder_name,
        directory: true
    }
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
        group_id: localStorage.getItem('group_id'),
        location: path
    }
    console.log(path)
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
            console.log(data)
            if (!current_directory.directory) {
                displayFolders()
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

function displayFolders() {
    $('#folders').empty()
    console.log(current_directory)
    if (!current_directory.directory) {
        $('#folders').append(`
            <a class="btn" onclick="downloadFile('${current_directory.link}', '${current_directory.name}')">Download</a>
        `)
        return
    }
    for (const folder of dir_folders) {
        if (folder.trash) {
            continue
        }
        $('#folders').append(`
            <div class="card-panel folder" onclick="selectFolder('${folder.name}')" oncontextmenu="setDeleteFolder(event, '${folder._id}')">
                <i class="material-icons left">${folder.folder ? 'folder' : 'insert_drive_file'}</i><span>${folder.name}</span>
            </div>
        `)
    }
}


function updatePath(index, flag) {
    dirs.length = index
    path = '/'
    let name = localStorage.getItem('group_name')
    $('.path-header').empty()
    $('.path-header').append(`<span class="dir"><i class="material-icons">keyboard_arrow_right</i><a class="path-nav" onclick="updatePath(0, true)">${name}</a></span>`)
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

function upload(file, public_key) {
    var reader = new FileReader()
    reader.onload = () => {
        let key = '1234567887654321'
        let wordArray = CryptoJS.lib.WordArray.create(reader.result)
        let encrypted = CryptoJS.AES.encrypt(wordArray, key).toString()
        let fileEnc = new Blob([encrypted])
        const formData = new FormData();
        let data = {
            group_id: localStorage.getItem('group_id'),
            parent: current_directory._id,
            location: current_directory.location
        }
        formData.append(JSON.stringify(data), fileEnc, file.name)
        $.ajax({
            url: 'http://127.0.0.1:3000/upload',
            headers: {
                token: localStorage.getItem('token')
            },
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
    reader.readAsArrayBuffer(file)
}

async function uploadFile(file) {
    const raw_public_key = localStorage.getItem('public_key')
    const public_key = await importPublicKey(raw_public_key)
    console.log(public_key)
    upload(file, public_key)
}

function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index = 0, word, i;
    for (i = 0; i < length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}

function downloadFile(link, name) {
    console.log(link)
    $('#download-name').modal('open')
    $.ajax({
        url: link,
        xhrFields: {
            responseType: 'arraybuffer'
        },
        xhr: function () {
            const xhr = new window.XMLHttpRequest();
            xhr.addEventListener('progress', function (event) {
                if (event.lengthComputable) {
                    const percentComplete = ((event.loaded / event.total) * 100).toFixed(2)
                    console.log(`Download progress: ${percentComplete}%`)
                    $('.download-value').text(percentComplete)
                    $('#download-bar').css('width', percentComplete + '%')
                }
            }, false)
            return xhr
        },
        success: (data) => {
            downloadIt(data)
        }
    })
    function downloadIt(data) {
        let reader = new FileReader()
        reader.onload = () => {
            let key = '1234567887654321'
            let decrypted = CryptoJS.AES.decrypt(reader.result, key)
            let typedArray = convertWordArrayToUint8Array(decrypted)
            const blob = new Blob([typedArray], { type: 'application/octet-stream' })
            const url = window.URL.createObjectURL(blob)
            const a = $('<a>').attr('href', url)
            a.attr('download', name)
            $('body').append(a)
            a[0].click()
            window.URL.revokeObjectURL(url)
            $('#download-name').modal('close')
        }
        reader.readAsText(new Blob([data], { type: 'application/octet-stream' }))
    }
}

// function uploadFile(file) {
//     const formData = new FormData();
//     let data = {
//         group_id: localStorage.getItem('group_id'),
//         parent: current_directory._id,
//         location: current_directory.location
//     }
//     formData.append(JSON.stringify(data), file)
//     $.ajax({
//         url: 'http://127.0.0.1:3000/upload',
//         headers: {
//             token: localStorage.getItem('token')
//         },
//         method: 'POST',
//         data: formData,
//         processData: false,
//         contentType: false,
//         success: function (response) {
//             console.log('success: ', response)
//         },
//         error: function (xhr, status, error) {
//             console.error('error: ', error)
//         }
//     })
// }

// function downloadFile(link, name) {
//     console.log(link)
//     $.ajax({
//         url: link,
//         xhrFields: {
//             responseType: 'arraybuffer'
//         },
//         success: (data) => {
//             downloadIt(data)
//         }
//     })
//     function downloadIt(data) {
//         const blob = new Blob([data], { type: 'application/octet-stream' })
//         const url = window.URL.createObjectURL(blob)
//         const a = $('<a>').attr('href', url)
//         a.attr('download', name)
//         $('body').append(a)
//         a[0].click()
//         window.URL.revokeObjectURL(url)
//     }
// }

function deleteFolder() {
    const data = {
        _id: delete_folder,
    }
    console.log(data)
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/delete',
        headers: {
            token: localStorage.getItem("token"),
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            current_directory = data
            console.log(data)
            if (!current_directory.directory) {
                displayFolders()
            }
            delete_folder = ''
            dir_folders = data.children
            console.log(dir_folders)
            displayFolders()
            $('#delete-name').modal('close')
        },
        error: function (error) {
            alert('something went wrong')
            console.log(error)
        }
    })
}

function createGroup() {
    let group_name = $('#group-name').find('input').val()
    const data = {
        name: group_name,
        user_id: localStorage.getItem('_id'),
        user_name: localStorage.getItem('name')
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/group/create',
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
    getPath()
}

function changeGroup(group_id, name) {
    localStorage.setItem('group_id', group_id)
    localStorage.setItem('group_name', name)
    location.reload()
}

function setDeleteFolder(event, _id) {
    event.preventDefault()
    delete_folder = _id
    console.log(delete_folder)
    $('#delete-name').modal('open')
}

$(document).ready(function () {
    getGroups()
    $('.folder').on('click', selectFolder)
    $('.modal').modal()
    $('#fileupload').on('submit', function (e) {
        e.preventDefault()
        const file = $('#upload-file')[0].files[0];
        uploadFile(file)
    })
})
