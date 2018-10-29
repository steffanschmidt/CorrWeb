function setup()
{
    var submit_btn = document.getElementById("confirm_info");
    submit_btn.addEventListener("click", user_validation);
};

var profile_vals = [];

function user_validation()
{
    var user = document.getElementById("user_name").value;
    var login_password = document.getElementById("PW").value;
    var validation = false;
    var priveledges = "user";

    $.getJSON("user_validation_info.json", function (user_data) {

        for (let i = 0; i < user_data.Users.length; i++)
        {
            if ((user === user_data.Users[i].username || user === user_data.Users[i].email) && (login_password === user_data.Users[i].password))
            {
                validation = true;
                priveledges = user_data.Users[i].role_status;
                //assign_current_json_vals(user_data.Users[i].id, user_data.Users[i].role_status, user_data.Users[i].username, user_data.Users[i].password, user_data.Users[i].email);
            break;
            };
        };

        login_form(validation, priveledges);

    });



};

//function assign_current_json_vals(id, role_stat, user, pw, email) {
//    // Setting up information for Profile section
//    profile_vals.push(id);
//    profile_vals.push(role_stat);
//    profile_vals.push(user);
//    profile_vals.push(pw);
//    profile_vals.push(email);
//};



function login_form(validation, access_level)
{
    if (validation) {
        window.open("index.html", "_self", false);
    }
    else {
        alert("Please check login information");
    };
};

// For Profile section
function profile_tools_setup() {
    var update_profil_button = document.getElementById("upd_prof");
    update_profil_button.addEventListener("click", update_profile);

    //var profile_user_name = document.getElementById("user_name_profile");
    //var profile_pw = document.getElementById("pw_profile");
    //var profile_id = document.getElementById("user_id_profile");
    //var profile_email = document.getElementById("email_profile");
    //var profile_access_level = document.getElementById("user_priveledges_profile");

    //profile_id.value = user_id_profile_val;
    //profile_access_level.value = user_priveledges_profile_val;
    //profile_user_name.value = user_name_profile_val;
    //profile_pw.value = pw_profile_val;
    //profile_email.value = email_profile_val;
};

function update_profile() {
    alert("Updating information");
};