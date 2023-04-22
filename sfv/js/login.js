
function loginUser() {
    const form = document.forms['login-form']
    const formData = new FormData(form)
    let data = {}
    for (const [k, v] of formData.entries()) {
        data[k] = v
    }
    console.log(data)
    /**
     * Validate the data
     * Ajax call here to login
     */
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/login',
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            localStorage.setItem('_id', data._id)
            localStorage.setItem('name', data.name)
            localStorage.setItem('email', data.email)
            localStorage.setItem('token', data.jwt)
            localStorage.setItem('groups', data.groups)
            localStorage.setItem('location', data._id + '/')
            localStorage.setItem('user_data', JSON.stringify(data))
            location.href = 'index.html'
        },
        error: function (error) {
            alert('Enter proper credentials')
            console.log(error)
        }
    })
}

$(document).ready(function () {
    $("#login-form").on('submit', function (e) {
        e.preventDefault()
        loginUser()
    })
})
