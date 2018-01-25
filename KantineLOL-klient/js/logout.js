$(document).ready(() => {


    Parse.$ = jQuery;
    Parse.initialize("...", "...");

    $('.form-logout').on('submit', function (e) {
        // Forbygger en default submit event
        e.preventDefault();

        console.log("Performing submit");

        //logout current user
        if ( Parse.User.current() ) {
            Parse.User.logOut();

            // kontroller om der er blevet logget ud korrekt
            if (Parse.User.current())
                console.log("Failed to log out!");
        }

        // do redirect
        //window.location.replace("Sign_In.html");
        // or
        window.location.href = "login.html";
    });
});