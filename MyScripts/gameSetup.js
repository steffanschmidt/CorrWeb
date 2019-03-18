// Game Canvas
var gameCanvas = document.getElementById("game");
ctx = gameCanvas.getContext("2d");
var scale = avoidBlurring(ctx);

// Ensuring Scale is in order -> avoids blurry text and small images
gameCanvas.width = 850 * scale;
gameCanvas.height = 458 * scale;
gameCanvas.style.width = 850 + "px";
gameCanvas.style.height = 458 + "px";
ctx.setTransform(scale, 0, 0, scale, 0, 0);

// Making a player canvas in order to avoid redrawing background all the time to improve performance
var playerCanvas = document.getElementById("playerCvs");
var playerCtx = playerCanvas.getContext("2d");
playerCtx.setTransform(scale, 0, 0, scale, 0, 0);
window.addEventListener("resize", movePlayerCanvas);


// constants
var doorImg = document.createElement("img");
var platformImg = document.createElement("img");
var windowImg = document.createElement("img");
doorImg.src = "../GameArt/DoorGame2.png";
platformImg.src = "../GameArt/DoorPlatform.png";
windowImg.src = "../GameArt/WindowGame.png";

var gravity = 1;
var velocityX = 3;
var velocityY = 5;
var soundOutside;
var soundInside;
var soundDoor;
var gameObjPos;
var gameHandler = null;
// Player Sizes
var playerSize = 30;
var playerEyeSize = 4;
var playerMouthSize = 15;
var playerColor = "red";
var playerEyeColor = "blue";
// Initiating game elements
var playerStartPosX = gameCanvas.width / 2 ;
var playerStartPosY = gameCanvas.height - playerSize;
var GameArea = new GameContainer();
var player = new Player(playerStartPosX, playerStartPosY, playerEyeSize, playerMouthSize, playerSize, playerColor, playerEyeColor);

function game_setup() {

    buttons = ["startGame", "resetPlayer", "stopGame", "soundBtn"];
    button_callback = [GameArea.startGame, GameArea.resetPlayerPosition, GameArea.quitGame, soundControls];
    for (let i = 0; i < buttons.length; i++) {
        $("#" + buttons[i]).bind("click", button_callback[i]);
    }
    sessionStorage.setItem("startedGame", 0);
    $("#bodyColorSelecter").on("change", function () {
        player.changePlayerColor(this.value);
    });
    $("#eyeColorSelecter").on("change", function () {
        player.changeEyeColor(this.value);
    });

    startBtnState();
    doorPositions = drawStage();

    if (sessionStorage.setItem("muted", 0) == null) {
        sessionStorage.setItem("muted", 0);
    }
    soundControls();

}
// Game functionality
function GameContainer() {
    this.soundElements = [];

    this.startGame = function () {
        sessionStorage.setItem("startedGame", 1);
        startBtnState();
        document.addEventListener("keydown", player.gameInput, false);
        movePlayerCanvas();
        player.setDefaultValues();
        player.drawPlayer();
        gameAnimation();
    };

    this.quitGame = function () {
        window.cancelAnimationFrame(gameHandler);
        sessionStorage.setItem("startedGame", 0);
        startBtnState();
        document.removeEventListener("keydown", player.gameInput);
        playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    };

    this.resetPlayerPosition = function () {
        alert("HAAAAEEELLPPP");
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        drawStage();
        player.setDefaultValues();
        player.drawPlayer();
    };

    this.startSounds = function () {

        this.soundElements = [];

    };

    this.muteSound = function () {
        this.soundElements.forEach(function (sound) {
            sound.mute;
        });
    };

    this.unmuteSound = function () {
        this.soundElements.forEach(function (sound) {
            sound.unmute;
        });
    };

    //this.draw = function () {

    //};

    this.update = function () {

        //this.draw();
    };

}

function Player(playerX, playerY, eyeSize, mouthSize, playerSize, playerColor, eyeColor) {
    this.playerX = playerX;
    this.playerY = playerY;
    this.vx = 4;
    this.vy = 0;
    this.eyeSize = eyeSize;
    this.mouthSize = mouthSize;
    this.playerSize = playerSize;
    this.playerColor = playerColor;
    this.eyeColor = eyeColor;
    this.keyMap = {};


    this.gameInput = function () {
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
    };

    this.movePlayer = function () {

    };

    this.setDefaultValues = function () {
        this.playerX = playerStartPosX;
        this.playerY = playerStartPosY;
    };

    this.changePlayerColor = function (chosenBodyColor) {
        this.playerColor = chosenBodyColor;
    };

    this.changeEyeColor = function (chosenEyeColor) {
        this.eyeColor = chosenEyeColor;
    };

    this.drawPlayer = function () {
        // Body
        playerCtx.beginPath();
        playerCtx.arc(this.playerX, this.playerY, this.playerSize, 0, 2 * Math.PI, false);
        playerCtx.fillStyle = this.playerColor;
        playerCtx.strokeStyle = "black";
        playerCtx.stroke();
        playerCtx.fill();
        // Mouth
        playerCtx.beginPath();
        playerCtx.arc(this.playerX, this.playerY + this.playerSize / 4, this.mouthSize, 0, Math.PI, false);
        playerCtx.moveTo(this.playerX - this.mouthSize, this.playerY + this.playerSize / 4);
        playerCtx.lineTo(this.playerX + this.mouthSize, this.playerY + this.playerSize / 4);
        playerCtx.fillStyle = "white";
        playerCtx.fill();
        playerCtx.stroke();
        // Eyes White Part
        playerCtx.beginPath();
        playerCtx.arc(this.playerX - this.mouthSize + 5, this.playerY - this.playerSize / 4, this.eyeSize + 2, 0, 2 * Math.PI, false);
        playerCtx.stroke();
        playerCtx.fill();
        playerCtx.beginPath();
        playerCtx.arc(this.playerX + this.mouthSize - 5, this.playerY - this.playerSize / 4, this.eyeSize + 2, 0, 2 * Math.PI, false);
        playerCtx.stroke();
        playerCtx.fill();
        // Eye Color
        playerCtx.beginPath();
        playerCtx.arc(this.playerX - this.mouthSize + 5, this.playerY - this.playerSize / 4, this.eyeSize, 0, 2 * Math.PI, false);
        playerCtx.arc(this.playerX + this.mouthSize - 5, this.playerY - this.playerSize / 4, this.eyeSize, 0, 2 * Math.PI, false);
        playerCtx.fillStyle = this.eyeColor;
        playerCtx.fill();
    };

    this.update = function () {
        playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        this.playerX += this.vx;

        if (this.playerX + playerSize >= playerCanvas.width || this.playerX - playerSize < 0) {
            this.vx = -this.vx;
        }

        this.drawPlayer();
    };
}

function gameAnimation() {
    gameHandler = window.requestAnimationFrame(gameAnimation);

    player.update();
    GameArea.update();
}

function movePlayer(keyInput) {

    if (keyInput == "E") {
        alert("Hello World");
    }
}

function drawStage() {
    doorPositions = [];
    var platformPos = [];
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
        doorPositions.push([(i + 0.5) * spaceX + (i - 0.5) * imgWidth, spaceY - movingThingsUp]); // coordinates for top doors
    }

    for (let i = 1; i < amountofDoorsBottom + 1; i++) {
        doorPositions.push([i * spaceX + (i - 1) * imgWidth, 2 * spaceY + imgHeight - movingThingsUp]); // coordinates for bottom doors
    }

    for (let i = 0; i < doorPositions.length; i++) {
        platformPos.push([doorPositions[i][0] - 5, doorPositions[i][1] + imgHeight - movingThingsUp]);
    }

    for (let i = 0; i < doorPositions.length; i++) {
        ctx.drawImage(doorImg, doorPositions[i][0], doorPositions[i][1]); // doors
        ctx.drawImage(platformImg, platformPos[i][0], platformPos[i][1]); // platforms
        ctx.drawImage(windowImg, doorPositions[i][0] + spaceX - 1.5 * windowImg.width + imgWidth / 2, doorPositions[i][1] + movingThingsUp / 2); // windows
        ctx.font = "bold 16px Arial";
        var doorTextWidth = ctx.measureText(doorText[i]).width;
        textDist = (imgWidth - doorTextWidth) / 2;
        ctx.fillStyle = "silver";
        ctx.fillRect(doorPositions[i][0] + textDist - 5, doorPositions[i][1] - 35, doorTextWidth + 10, 25);
        ctx.fillStyle = "black";
        ctx.fillText(doorText[i], doorPositions[i][0] + textDist, doorPositions[i][1] - 15);
    }

    ctx.drawImage(windowImg, spaceX + (imgWidth - windowImg.width) / 2, spaceY - movingThingsUp / 2);
    ctx.drawImage(windowImg, (spaceX - windowImg.width) / 2, 2 * spaceY + imgHeight - movingThingsUp / 2);

    gameObjPos = [doorPositions, platformPos];

    return gameObjPos;
}

// Sound Stuff
function soundControls() {

    var mutedBtn = document.getElementById("soundBtn");
    var mutedVal = sessionStorage.getItem("muted");

    if (mutedVal == 0) {
        mutedBtn.innerText = "Mute";
        sessionStorage.setItem("muted", 1);
        GameArea.unmuteSound();
    }
    else {
        mutedBtn.innerText = "Unmute";
        sessionStorage.setItem("muted", 0);
        GameArea.muteSound();
    }
}

function sound(source) {
    this.sound = document.createElement("audio");
    this.sound.src = source;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.mute = function () {
        this.sound.muted = true;
    };
    this.unmute = function () {
        this.sound.muted = false;
    };
}

// Miscellaneous functions
function startBtnState() {

    var startBtn = document.getElementById("startGame");
    var quitBtn = document.getElementById("stopGame");
    var resetPlayerBtn = document.getElementById("resetPlayer");

    if (sessionStorage.getItem("startedGame") == 1) {
        quitBtn.disabled = false;
        resetPlayerBtn.disabled = false;
        startBtn.disabled = true;
        $("#bodyColorSelecter").attr("disabled", false);
        $("#eyeColorSelecter").attr("disabled", false);
    }
    else {
        quitBtn.disabled = true;
        resetPlayerBtn.disabled = true;
        startBtn.disabled = false;
        $("#bodyColorSelector").attr("disabled", "disabled");
        $("#eyeColorSelector").attr("disabled", "disabled");
    }
}

function avoidBlurring(ctx) {
    var devicePixelRatio = window.devicePixelRatio;
    var bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    var scale = devicePixelRatio / bsr;
    return scale;
}

function movePlayerCanvas() {
    var bckGroundCanvasLeft = gameCanvas.getBoundingClientRect().left;
    var bckGroundCanvasTop = gameCanvas.getBoundingClientRect().top;
    playerCanvas.style.left = bckGroundCanvasLeft + "px";
    playerCanvas.style.top = bckGroundCanvasTop + "px";
    playerCanvas.width = 850 * scale;
    playerCanvas.height = 458 * scale;
}