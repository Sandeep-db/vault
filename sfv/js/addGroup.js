function getGroups() {
  const data = {
    user_id: localStorage.getItem("_id"),
  };
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:3000/user/get-groups",
    headers: {
      token: localStorage.getItem("token"),
    },
    contentType: "application/json",
    data: JSON.stringify(data),
    dataType: "json",
    success: function (data) {
      console.log("data", data);
      grpdata = data;
      displayGroups(data);
    },
    error: function (error) {
      alert("folder not created");
      console.log(error);
    },
  });
}

function displayGroups(data) {
  $("#groups").empty();
  let gid = localStorage.getItem("group_id");
  if (!gid || gid == localStorage.getItem("_id")) {
    localStorage.setItem("group_id", data[0].group_id);
    localStorage.setItem("group_name", data[0].name);
  }
  for (const group of data) {
    let flag = gid == group._id;
    $("#groups").append(`
            <li class="${flag ? "active" : ""}">
                <a><i class="material-icons" onclick="getmembers('${
                  group.group_id
                }')">inbox</i>${group.name}</a>
            </li>
        `);
  }
  $("#members").empty();

  // getPath()
}

function getmembers(group_id) {
  localStorage.setItem("group_id", group_id);
  console.log("pressed");

  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:3000/group/getgrp",
    headers: {
      token: localStorage.getItem("token"),
    },
    contentType: "application/json",
    data: JSON.stringify({ group_id: group_id }),
    dataType: "json",
    success: function (data) {
  $("#members").empty();

      console.log("members", data);
      for (const i of data.members) {
        $("#members").append(`
            <li >
            <a >${i.name}</a>
                
            </li>
        `);
      }
    },
  });
}

function adduser(){
 const group_id = localStorage.getItem("group_id");
  const user_email = $("#usergrp").val();
  const user_name = $("#usergrpname").val();
  $.ajax({
    type: "POST",
    url:"http://127.0.0.1:3000/group/adduser",
    headers: {
      token: localStorage.getItem("token"),
    },
    contentType: "application/json",
    data: JSON.stringify({ group_id: group_id, user_email: user_email ,user_name:user_name}),
    dataType: "json",
    success: function (data) {
      console.log("data", data);
      location.reload();
    },
    error: function (error) {
      console.log("data", data);
    }
  })
}

$(document).ready(function () {
  getGroups();
  $('.modal').modal();
});
