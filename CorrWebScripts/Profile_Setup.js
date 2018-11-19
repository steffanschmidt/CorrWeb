var profileInformation = new Array();
var user_id = sessionStorage.getItem("user-ID");

function profile_tools_setup()
{
    $("#upd_prof").on("click", update_profile);
    document.addEventListener("keypress", function (event)
    {
        if (event.which === 13 || event.keyCode === 13) {
            $("#upd_prof").click();
        }
    });

    getProfileInformation();
}

function getProfileInformation()
{
    $.ajax({
        url: "user_validation_info.json",
        timeout: 10000,
        type: "GET"
    }).done(function (user_data) {
        try {
            for (let i = 0; i < user_data.Users.length; i++)
            {
                if (user_data.Users[i].id === user_id) {
                    profileInformation[0] = user_data.Users[i].id;
                    profileInformation[1] = user_data.Users[i].username;
                    profileInformation[2] = user_data.Users[i].email;
                    profileInformation[3] = user_data.Users[i].password;
                    profileInformation[4] = user_data.Users[i].role_status;
                    break;
                }
            }
        }
        catch (error) {
            alert("Failed access profile data. Error:" + error.message);
        }

        $("#user_id_profile").val(profileInformation[0]);
        $("#username_profile").val(profileInformation[1]);
        $("#email_profile").val(profileInformation[2]);
        $("#pw_profile").val(profileInformation[3]);
        $("#user_priveledges_profile").val(profileInformation[4]);

    }).fail(function () {
        alert("Failed to load in profile information.");
    });
}

function update_profile()
{
    alert("Updating Profile");
}

