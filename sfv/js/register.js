
function registerUser() {
    const form = document.forms['register-form']
    const formData = new FormData(form)
    let data = {}
    for (const [k, v] of formData.entries()) {
        data[k] = v
    }
    /** 
     * Validate and
     * Ajax request to register
     */
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/register',
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            console.log(data)
            location.href = 'login.html'
        },
        error: function (error) {
            alert('something went wrong')
            console.log(error)
        }
    })
}

$(document).ready(function () {
    $("#register-form").on('submit', function (e) {
        e.preventDefault()
        registerUser()
    })
})
