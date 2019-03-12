function game_setup() {

    buttons = ["startGame", "resetPlayer", "stopGame"];
    button_callback = [initiateGame, resetPlayerPosition, quitGame];
    for (let i = 0; i < buttons.length; i++) {
        $("#" + buttons[i]).bind("click", button_callback[i]);
    }
    sessionStorage.setItem("startedGame", 0);
    startBtnState();
    drawStage()

}

// Game Canvas
var gameCanvas = document.getElementById("game");
ctx = gameCanvas.getContext("2d");
var devicePixelRatio = window.devicePixelRatio;
var bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
var scale = devicePixelRatio / bsr;

// Ensuring Scale is in order -> avoids blurry text and small images
gameCanvas.width = 850 * scale;
gameCanvas.height = 458 * scale;
gameCanvas.style.width = 850 + "px";
gameCanvas.style.height = 458 + "px";
ctx.setTransform(scale, 0, 0, scale, 0, 0);

// Making a player canvas in order to avoid redrawing background all the time to improve performance
var playerCanvas = document.getElementById("playerCvs");
playerCtx = playerCanvas.getContext("2d");
movePlayerCanvas();
playerCtx.setTransform(scale, 0, 0, scale, 0, 0);


// constants
var playerImg = document.createElement("img");
playerImg.src = "../GameArt/PlayerGame.png";
var gravity = 1;
var jumpHeight = 20;
var moveLength = 3;

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

function drawStage() {
    var doorPositions = [];
    var doorImg = document.createElement("img");
    var platformImg = document.createElement("img");
    var windowImg = document.createElement("img");
    doorImg.src = "../GameArt/DoorGame2.png";
    platformImg.src = "../GameArt/DoorPlatform.png";
    windowImg.src = "../GameArt/WindowGame.png";

    doorImg.onload = function () {
        platformImg.onload = function () {
            windowImg.onload = function () {
                var doorText = ["About Me", "Core Competencies", "Nanoscience", "Chemistry", "Materials Science", "Practical Work", "Programming"];
                var imgHeight = doorImg.height;
                var imgWidth = doorImg.width;
                var amountOfDoorsTop = 3;
                var amountofDoorsBottom = 4;
                var movingThingsUp = 15;
                var spaceX = (gameCanvas.width - 4 * imgWidth) / 5;
                var spaceY = (gameCanvas.height - 2 * imgHeight) / 3;
                var textDist;

                for (let i = 1; i < amountOfDoorsTop + 1; i++) {
                    doorPositions.push([(i + 0.5) * spaceX + (i - 0.5) * imgWidth, spaceY]); // coordinates for top doors
                }

                for (let i = 1; i < amountofDoorsBottom + 1; i++) {
                    doorPositions.push([i * spaceX + (i - 1) * imgWidth, 2 * spaceY + imgHeight]); // coordinates for bottom doors
                }

                for (let i = 0; i < doorPositions.length; i++) {
                    ctx.drawImage(doorImg, doorPositions[i][0], doorPositions[i][1] - movingThingsUp); // doors
                    ctx.drawImage(platformImg, doorPositions[i][0] - 5, doorPositions[i][1] + imgHeight - movingThingsUp); // platforms
                    ctx.drawImage(windowImg, doorPositions[i][0] + spaceX - 1.5 * windowImg.width + imgWidth / 2, doorPositions[i][1] - movingThingsUp / 2); // windows
                    ctx.font = "bold 16px Arial";
                    var doorTextWidth = ctx.measureText(doorText[i]).width;
                    textDist = (imgWidth - doorTextWidth) / 2;
                    ctx.fillStyle = "white";
                    ctx.fillRect(doorPositions[i][0] + textDist - 5, doorPositions[i][1] - 50, doorTextWidth + 10, 25);
                    ctx.fillStyle = "black";
                    ctx.fillText(doorText[i], doorPositions[i][0] + textDist, doorPositions[i][1] - 30);
                }

                ctx.drawImage(windowImg, spaceX + (imgWidth - windowImg.width) / 2, spaceY - movingThingsUp / 2);
                ctx.drawImage(windowImg, ( spaceX - windowImg.width ) / 2 , 2 * spaceY + imgHeight - movingThingsUp / 2);
            };
        };
    };
}

function movePlayerCanvas() {
    var bckGroundCanvasLeft = gameCanvas.getBoundingClientRect().left;
    var bckGroundCanvasTop = gameCanvas.getBoundingClientRect().top;
    playerCanvas.style.left = bckGroundCanvasLeft + "px";
    playerCanvas.style.top = bckGroundCanvasTop + "px";
    playerCanvas.width = 850 * scale;
    playerCanvas.height = 458 * scale;
}

function initiateGame() {
    document.addEventListener("keydown", gameInput, false);
    sessionStorage.setItem("startedGame", 1);
    startBtnState();
    initiatePlayer();
}

function initiatePlayer() {
    var playerPosXInit = (gameCanvas.width - playerImg.width) / 2;
    var playerPosYInit = gameCanvas.height - playerImg.height;
    playerCtx.drawImage(playerImg, playerPosXInit, playerPosYInit);
}

function resetPlayerPosition() {
    alert("HAAAAEEELLPPP");
}

function quitGame() {
    sessionStorage.setItem("startedGame", 0);
    startBtnState();
    document.removeEventListener("keydown", gameInput);
    playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    alert("I QUIT!");
}

function movePlayer(keyInput) {

    if (keyInput == "E") {
        ctx.clearRect(0 , 0, gameCanvas.width, gameCanvas.height);
        drawDoorWays();
    }

}

function updateWorld() {

}

function updatePlayer() {

}