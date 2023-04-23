const user = JSON.parse(localStorage.getItem('user_data'))
let namee = localStorage.getItem('name')
let email = localStorage.getItem('email')
let _id = localStorage.getItem('_id')

$(document).ready(function () {
    $('#namelabel').text(namee)
    $('#emaillabel').text(email)
})


function updateProfile(e) {
    e.preventDefault()
    const data = {
        _id: _id,
        name: $('#name').val(),
        email: $('#email').val(),
        passwd: $('#passwd').val()
    }
    console.log("toupdate",data)
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/updateprofile',
        headers: {
            token: localStorage.getItem("token"),
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            console.log("up",data)
            localStorage.setItem('name', data.result.name)
            localStorage.setItem('email', data.result.email)
            // alert('Profile updated successfully')
            // location.reload()
        }
    })


}