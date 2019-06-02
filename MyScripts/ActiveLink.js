function setupCoreCompetencies() {

    var btnList = ["theoreticalBtn", "practicalBtn", "chemistryBtn", "corrosionBtn", "programmingBtn"];

    for (let i = 0; i < btnList.length; i++) {

        $("#" + btnList[i]).bind("click", showHideCompetencies);
    }

}




function findActiveLink() {
    var currentUrl = window.location.href.split("#")[0];
    $(".navigationalcontainer a").each(function () {
        if (currentUrl === this.href) {
            $(this).closest("a").addClass("activeLink");
        }
    });
}

function showHideCompetencies() {
    let btnName = this.id;
    var elementToShowHide = null;
    console.log(btnName);
    switch (btnName) {
        case "theoreticalBtn":
            elementToShowHide = document.getElementById("theoreticalExtra");
            break;
        case "practicalBtn":
            elementToShowHide = document.getElementById("practicalExtra");
            break;
        case "chemistryBtn":
            elementToShowHide = document.getElementById("chemistryExtra");
            break;
        case "corrosionBtn":
            elementToShowHide = document.getElementById("corrosionExtra");
            break;
        case "programmingBtn":
            elementToShowHide = document.getElementById("programmingExtra");
            break;
    }

    if (elementToShowHide.style.display === "block") {
        elementToShowHide.style.display = "none";
        this.innerText = "Show Extra";
    } else
    {
        elementToShowHide.style.display = "block";
        this.innerText = "Hide Extra";
    }
}