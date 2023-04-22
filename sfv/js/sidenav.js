
$(document).ready(function() {
    let token = localStorage.getItem('token')
    if (!token) {
        location.href = 'login.html'
        return
    }
    $('.home-nav').click(function() {
        location.href = 'index.html'
    })
    $('.group-nav').click(function() {
        location.href = 'group.html'
    })
    $('.status-nav').click(function() {
        location.href = 'status.html'
    })
    $('.profile-nav').click(function() {
        location.href = 'profile.html'
    })
    $('.trash-nav').click(function() {
        location.href = 'trash.html'
    })
    $('.logout').click(function() {
        localStorage.clear()
        location.href = 'login.html'
    })
})