$(document).ready(() => {

  SDK.User.loadNav();

  $("#login-button").click(() => {
    console.log("test om det virker");

    const username = $("#inputUsername").val();
    const password = $("#inputPassword").val();

          SDK.User.login(username, password, (err, data) => {
              if (err && err.xhr.status === 401) {
                  $(".form-group").addClass("has-error");
      }
      else if (err){
        console.log("Der skete røv og nøgler")
      } else {
        window.location.href = "home-page.html";
      }
    });

  });

});