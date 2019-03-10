function game_setup() {

    buttons = ["startGame", "resetPlayer", "stopGame"];
    button_callback = [initiateGame, resetPlayerPosition, quitGame];
    for (let i = 0; i < buttons.length; i++) {
        $("#" + buttons[i]).bind("click", button_callback[i]);
    }

    sessionStorage.setItem("startedGame", 0);
    startBtnState();

}

// Game Canvas
var gameCanvas = document.getElementById("game");
ctx = gameCanvas.getContext("2d");

// constants
var gravity = 1;
var jumpHeight = 20;
var moveLength = 3;

var playerPosXInit = gameCanvas.width / 2;
var playerPosYInit = gameCanvas.height;

drawDoorWays();

document.addEventListener("keydown", gameInput, false);

function gameInput(event) {
    switch (event.keyCode) {
        case 65: // A for moving Left
            movePlayer("A");
            break;
        case 87: // W for jumping
            movePlayer("W");
            break;
        case 68: // D for moving to the right
            movePlayer("D"); // 
            break;
        case 69: // E for Entering door
            movePlayer("E");
            break;
        default:
            return;

    }
}

function startBtnState() {

    var startBtn = document.getElementById("startGame");
    var quitBtn = document.getElementById("stopGame");
    var resetPlayerBtn = document.getElementById("resetPlayer");

    if (sessionStorage.getItem("startedGame") == 1) {
        quitBtn.disabled = false;
        resetPlayerBtn.disabled = false;
        startBtn.disabled = true;        
    }
    else {
        quitBtn.disabled = true;
        resetPlayerBtn.disabled = true;
        startBtn.disabled = false;
        
    }
}

function constructPlatform() {
    return;
}

function drawDoorWays() {
    var image = document.createElement("img");
    image.src = "../GameArt/DoorGame.png";
    image.onload = function () {
        ctx.drawImage(image, 0, 0);
    };
    
    
}

function initiateGame() {
    alert("LET ME IN!");
    sessionStorage.setItem("startedGame", 1);
    startBtnState();
    initiateMap();

    
}

function initiateMap() {
    alert("Initiated Map");
}

function resetPlayerPosition() {
    alert("HAAAAEEELLPPP");
}

function quitGame() {
    sessionStorage.setItem("startedGame", 0);
    startBtnState();
    alert("I QUIT!");
}

function movePlayer(keyInput) {
    alert(keyInput);
}

function updateWorld() {

}

function updatePlayer() {

}