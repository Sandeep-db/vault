
function search(value) {
    if (value == '') {
        $('#search-obj').show()
        $('#search-results').hide()
        return
    }
    const data = {
        group_id: localStorage.getItem('group_id'),
        file_name: value
    }
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/search',
        headers: {
            token: localStorage.getItem('token')
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            console.log(data)
            displayResults(data)
        },
        error: function (error) {
            alert('something went wrong')
            console.log(error)
        }
    })
}

function setPath(path) {
    console.log(path)
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

function displayResults(data) {
    if (!data.length) {
        return
    }
    $('#search-obj').hide()
    $('#search-results').show()
    $('#search-results').empty()
    for (const folder of data) {
        $('#search-results').append(`
            <div onclick="setPath('${folder.location}')">
                <input type="search" value="${folder.name}" disabled="true"/>
                <button class="btn" style="width: 100% !important">Go</button>
            </div>
        `)
    }
}

$(document).ready(function () {
    $('#search-obj').show()
    $('#search-results').hide()
})