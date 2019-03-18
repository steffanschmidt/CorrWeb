function home_setup() {


    document.getElementById("turnOnAnimation").addEventListener("click", setAnimationOn);
    document.getElementById("turnOffAnimation").addEventListener("click", setAnimationOff);

    if (sessionStorage.getItem("animation") == null) {
        sessionStorage.setItem("animation", 1);
    }
    btnAnimationState(); 
}

function btnAnimationState() {
    if (sessionStorage.getItem("animation") == 1) {
        document.getElementById("turnOnAnimation").disabled = true;
        document.getElementById("turnOffAnimation").disabled = false;
    }
    else {
        document.getElementById("turnOnAnimation").disabled = false;
        document.getElementById("turnOffAnimation").disabled = true;
    }
}

function setAnimationOn() {
    sessionStorage.setItem("animation", 1);
    btnAnimationState();
    startAnimation();
}

function setAnimationOff() {
    sessionStorage.setItem("animation", 0);
    btnAnimationState();
    stopAnimation();
}

