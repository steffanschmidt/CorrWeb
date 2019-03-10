function findActiveLink() {
    var currentUrl = window.location.href;
    $(".navigationalcontainer a").each(function () {

        if (currentUrl === this.href) {
            $(this).closest("a").addClass("activeLink");
        }

    });
}