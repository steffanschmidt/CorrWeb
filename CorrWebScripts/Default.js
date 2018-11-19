function defaultSetup()
{
    $("#logout_btn").on("click", confirmLogout);
}



function confirmLogout() {
    if (confirm("Are you sure you want to logout?")) {
        $("#logout_btn").attr("href", "index.html");
    }
    else {
        return;
    }
}