


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









$(document).ready(function () {
    $('#fileupload').on('submit', function (e) {
        e.preventDefault()
        const file = $('#upload-file')[0].files[0];
        uploadFile(file)
    })
})
