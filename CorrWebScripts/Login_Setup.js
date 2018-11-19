function setup()
{
    var submit_btn = document.getElementById("confirm_info");
    submit_btn.addEventListener("click", user_validation);

    document.addEventListener("keypress", function (event)
    {
        if (event.which === 13 || event.keyCode === 13) {
            submit_btn.click();
        }
    });

}

function controlSessionStorage()
{
    return 'sessionStorage' in window;
}


function user_validation()
{
    var user = document.getElementById("user_name").value;
    var login_password = document.getElementById("PW").value;
    var validation = false;

    $.ajax({
        url: "user_validation_info.json",
        timeout: 10000,
        type: "GET"
    }).done(function (user_data) {

        try
        {
            for (let i = 0; i < user_data.Users.length; i++)
            {
                if ((user === user_data.Users[i].username || user === user_data.Users[i].email)
                    && login_password === user_data.Users[i].password) {
                    validation = true;
                    profile_vals = user_data.Users[i];
                    if (controlSessionStorage()) {
                        try {
                            sessionStorage.setItem("user-ID", user_data.Users[i].id);
                        }
                        catch (error) {
                            alert(error.message);
                        }
                    }
                    else { alert("Your browser does not support session storage. This will decrease functionality of the 'Profile' section") };
                    login_form(validation);
                    break;
                }
            }

            if (!validation) {
                alert("Please control login information");
            }

        }
        catch (exception)
        {
            alert(exception.message);
        }   

    }).fail(function () {
        alert("Unable to load in user information.");
    });
}


function login_form(validation)
{
    if (validation) {
        window.open("home.html", "_self", false);
    }
    else {
        alert("Please check login information");
    }
}