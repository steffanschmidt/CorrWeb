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

// Making room canvas
var roomCanvas = document.getElementById("roomCvs");
var roomCtx = roomCanvas.getContext("2d");
roomCtx.setTransform(scale, 0, 0, scale, 0, 0);
window.addEventListener("resize", moveRoomCanvas);


// constants
var doorImg = document.createElement("img");
var platformImg = document.createElement("img");
var windowImg = document.createElement("img");
doorImg.src = "../GameArt/DoorGame2.png";
platformImg.src = "../GameArt/DoorPlatform.png";
windowImg.src = "../GameArt/WindowGame.png";

var gravity = 0.1;
var velocityX = 4;
var smallJumpY = 5;
var velocityY = 7;
var backgroundSound;
var backgroundSoundPath = "../Music/beethoven_moonlight_sonata.mp3";
var doorSound;
var doorSoundPath = "../Music/doorSound.wav";
var soundMuted = false;
var soundElements = [];
var gameObjPos;
var gameHandler = null;
// Player Sizes
var playerSize = 25;
var playerEyeSize = 4;
var playerMouthSize = 15;
var playerColor = "red";
var playerEyeColor = "blue";
// Initiating game elements
var playerStartPosX = gameCanvas.width / 2;
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

    moveRoomCanvas();
    startBtnState();
    gameObjPos = drawStage();

    if (sessionStorage.setItem("muted", 0) === null) {
        sessionStorage.setItem("muted", 0);
    }
    
    soundControls();

}

// Game functionality
function GameContainer() {   

    this.startGame = function () {
        sessionStorage.setItem("startedGame", 1);
        startBtnState();
        $(document).off();
        $(document).on("keydown", function (event) {
            player.gameInput(event.keyCode);
        });
        $(document).on("keyup", function (event) {
            player.removeInput(event.keyCode);
        });
        movePlayerCanvas();
        if (player === null) {
            player = new Player(playerStartPosX, playerStartPosY, playerEyeSize, playerMouthSize, playerSize, playerColor, playerEyeColor);
        }
        player.setDefaultValues();
        player.drawPlayer();
        backgroundSound = new soundEffect(backgroundSoundPath);
        backgroundSound.play();
        doorSound = new soundEffect(doorSoundPath);
        soundElements.push(backgroundSound);
        soundElements.push(doorSound);
        gameAnimation();
    };

    this.quitGame = function () {
        window.cancelAnimationFrame(gameHandler);
        sessionStorage.setItem("startedGame", 0);
        startBtnState();
        player.resetKeyInput();
        playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        roomCanvas.style.zIndex = "-1";
        player = null;
        backgroundSound.stopSound();
        doorSound.stopSound();
        backgroundSound = null;
        doorSound = null;
    };

    this.resetPlayerPosition = function () {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        playerCtx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        drawStage();
        player.setDefaultValues();
        player.drawPlayer();
    };

    this.muteSound = function () {
        for (let i = 0; i < soundElements.length; i++) {
            console.log("In mute sound");
            soundElements[i].mute();
        }
    };

    this.unmuteSound = function () {
        for (let i = 0; i < soundElements.length; i++) {
            console.log("In unmute sound");
            soundElements[i].unmute();
        }
    };
}

function Player(playerX, playerY, eyeSize, mouthSize, playerSize, playerColor, eyeColor) {
    this.playerX = playerX;
    this.playerY = playerY;
    this.vx = 0;
    this.vy = 0;
    this.eyeSize = eyeSize;
    this.mouthSize = mouthSize;
    this.playerSize = playerSize;
    this.playerColor = playerColor;
    this.eyeColor = eyeColor;
    this.keyMap = { 65: false, 87: false, 68: false, 69: false };
    this.validDoorLocation = false;
    this.playerInsideRoom = false;
    this.doorIndex = null;
    this.jumping = false;
    this.rowLocation = null;
    this.currentRoom = null;

    console.log(this.playerInsideRoom);
    this.gameInput = function (keyCode) {

        if (keyCode in this.keyMap) {
            this.keyMap[keyCode] = true;

            if (this.keyMap[65]) { // A
                this.vx = -velocityX;
            }

            if (this.keyMap[68]) { // D
                this.vx = velocityX;
            }

            if (this.keyMap[87]) { // W
                this.jump();
            }

            if (this.keyMap[69]) { // E
                if (this.doorIndex !== null || this.playerInsideRoom && this.jumping) {
                    if (this.playerInsideRoom) {
                        console.log("Called to outside");
                        roomCanvas.style.zIndex = "-1";
                        this.playerInsideRoom = false;

                        if (this.currentRoom === 1) {
                            this.playerX = gameObjPos[1][0][0] + platformImg.width / 2;
                            this.playerY = gameObjPos[1][0][1] - playerSize - 1;
                        } else if (this.currentRoom === 2) {
                            this.playerX = gameObjPos[1][1][0] + platformImg.width / 2;
                            this.playerY = gameObjPos[1][1][1] - playerSize - 1;
                        }else if (this.currentRoom === 3) {
                            this.playerX = gameObjPos[1][2][0] + platformImg.width / 2;
                            this.playerY = gameObjPos[1][2][1] - playerSize - 1;
                        } else if (this.currentRoom === 4) {
                            this.playerX = gameObjPos[1][3][0] + platformImg.width / 2;
                            this.playerY = gameObjPos[1][3][1] - playerSize - 1;
                        } else if (this.currentRoom === 5) {
                            this.playerX = gameObjPos[1][4][0] + platformImg.width / 2;
                            this.playerY = gameObjPos[1][4][1] - playerSize - 1;
                        } else if (this.currentRoom === 6) {
                            this.playerX = gameObjPos[1][5][0] + platformImg.width / 2;
                            this.playerY = gameObjPos[1][5][1] - playerSize - 1;
                        } else if (this.currentRoom === 7) {
                            this.playerX = gameObjPos[1][6][0] + platformImg.width / 2;
                            this.playerY = gameObjPos[1][6][1] - playerSize - 1;
                        }
                        doorSound.play();
                        this.doorIndex = null;
                    }
                    else {
                        console.log("Called to inside");
                        roomCanvas.style.zIndex = "1";
                        this.playerInsideRoom = true;
                        this.currentRoom = this.doorIndex;
                        this.playerX = playerStartPosX;
                        this.playerY = playerStartPosY;
                        enterRoom(this.doorIndex);
                    } 
                }
            }
        }
    };

    this.jump = function () {
        if (this.jumping) {
            this.jumping = false;
            if (this.rowLocation === 2 || this.rowLocation === 0) {
                this.vy += -smallJumpY;
            } else {
                this.vy += -velocityY;
            }  
        }
    };

    this.removeInput = function (key) {
        if (key in this.keyMap) {

            this.keyMap[key] = false;
            if (key == 68 || key == 65) {
                this.clearSpeedX();
            }
        }
    };

    this.resetKeyInput = function () {
        this.keyMap = null;
    };

    this.clearSpeedX = function () {
        this.vx = 0;
    };

    this.setDefaultValues = function () {
        this.playerX = playerStartPosX;
        this.playerY = playerStartPosY;
        this.vx = 0;
        this.vy = 0;
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
        this.playerY += this.vy;

        if (this.playerX + playerSize > playerCanvas.width) {
            this.vx = 0;
            this.playerX = playerCanvas.width - playerSize - 2;
        }

        if (this.playerX - playerSize < 0) {
            this.vx = 0;
            this.playerX = playerSize + 2;
        }

        if (this.playerY - playerSize == 0) {
            this.vy = -this.vy;
        }

        if (this.playerY < playerCanvas.height - playerSize - 1) {
            this.vy += gravity;
        }

        if (this.playerY + playerSize >= playerCanvas.height) {
            this.playerY = playerCanvas.height - playerSize;
            this.vy = 0;
            this.jumping = true;
            this.rowLocation = 0;
            this.vy += -1;
        }


        // This only occurs if a player is outside a room
        if (!this.playerInsideRoom) {
            // Checking for top ledges
            if (this.playerY <= gameObjPos[1][0][1] * 1.04 - playerSize && this.playerY > gameObjPos[1][0][1] - playerSize) {
                if (this.playerX >= gameObjPos[1][0][0] && this.playerX <= gameObjPos[1][0][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][1][0] && this.playerX <= gameObjPos[1][1][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][2][0] && this.playerX <= gameObjPos[1][2][0] + platformImg.width) {
                    // Necessary to avoid tunneling through a ledge
                    if (this.vy >= 0) {
                        this.playerY = gameObjPos[1][0][1] - playerSize;
                        this.vy = 0;
                        this.rowLocation = 2;
                    }
                }
            }
            // Checking for bottom ledges
            if (this.playerY <= gameObjPos[1][3][1] * 1.04 - playerSize && this.playerY > gameObjPos[1][3][1] - playerSize) {
                if (this.playerX >= gameObjPos[1][3][0] && this.playerX <= gameObjPos[1][3][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][4][0] && this.playerX <= gameObjPos[1][4][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][5][0] && this.playerX <= gameObjPos[1][5][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][6][0] && this.playerX <= gameObjPos[1][6][0] + platformImg.width) {
                    if (this.vy >= 0) {
                        this.playerY = gameObjPos[1][3][1] - playerSize;
                        this.vy = 0;
                        this.rowLocation = 1;
                    }
                }
            }

            // Checking for a valid door location, setting which if true and writing text for being able to enter a room
            if (this.validDoorLocation && this.jumping) {
                    if (this.rowLocation === 2) {
                        if (this.playerX >= gameObjPos[1][0][0] && this.playerX <= gameObjPos[1][0][0] + platformImg.width) {
                            this.doorIndex = 1; // About Me
                            writeEnterRoomText(this.playerX, this.playerY);
                        }
                        else if (this.playerX >= gameObjPos[1][1][0] && this.playerX <= gameObjPos[1][1][0] + platformImg.width) {
                            this.doorIndex = 2; // Core Competencies
                            writeEnterRoomText(this.playerX, this.playerY);
                        }
                        else if (this.playerX >= gameObjPos[1][2][0] && this.playerX <= gameObjPos[1][2][0] + platformImg.width) {
                            this.doorIndex = 3; // Nanoscience
                            writeEnterRoomText(this.playerX, this.playerY);
                        }
                    }

                    if (this.rowLocation === 1) {
                        if (this.playerX >= gameObjPos[1][3][0] && this.playerX <= gameObjPos[1][3][0] + platformImg.width) {
                            this.doorIndex = 4; // Chemistry
                            writeEnterRoomText(this.playerX, this.playerY);
                        }
                        else if (this.playerX >= gameObjPos[1][4][0] && this.playerX <= gameObjPos[1][4][0] + platformImg.width) {
                            this.doorIndex = 5; // Material Science
                            writeEnterRoomText(this.playerX, this.playerY);
                        }
                        else if (this.playerX >= gameObjPos[1][5][0] && this.playerX <= gameObjPos[1][5][0] + platformImg.width) {
                            this.doorIndex = 6; // Practical Work
                            writeEnterRoomText(this.playerX, this.playerY);
                        }
                        else if (this.playerX >= gameObjPos[1][6][0] && this.playerX <= gameObjPos[1][6][0] + platformImg.width) {
                            this.doorIndex = 7; // Programming
                            writeEnterRoomText(this.playerX, this.playerY);
                        }
                    }
                }

            // jumping effect
            // top condition
            if (this.playerY === gameObjPos[1][0][1] - playerSize) {
                if (this.playerX >= gameObjPos[1][0][0] && this.playerX <= gameObjPos[1][0][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][1][0] && this.playerX <= gameObjPos[1][1][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][2][0] && this.playerX <= gameObjPos[1][2][0] + platformImg.width) {
                    this.vy += -1;
                    this.jumping = true;
                    this.validDoorLocation = true;
                }
            }

            // bottom condition
            if (this.playerY === gameObjPos[1][3][1] - playerSize) {
                if (this.playerX >= gameObjPos[1][3][0] && this.playerX <= gameObjPos[1][3][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][4][0] && this.playerX <= gameObjPos[1][4][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][5][0] && this.playerX <= gameObjPos[1][5][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][6][0] && this.playerX <= gameObjPos[1][6][0] + platformImg.width) {
                    this.vy += -1;
                    this.jumping = true;
                    this.validDoorLocation = true;
                }
            }

            // Bouncing off ledges from bottom and top
            if (this.playerY <= playerSize + 1) {
                this.playerY = playerSize + 2;
                this.vy *= -1;
            }

            // bottom ledges
            if (this.playerY >= gameObjPos[1][3][1] + playerSize + platformImg.height &&
                this.playerY <= (gameObjPos[1][3][1] + playerSize + platformImg.height) * 1.04) {
                if (this.playerX >= gameObjPos[1][3][0] && this.playerX <= gameObjPos[1][3][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][4][0] && this.playerX <= gameObjPos[1][4][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][5][0] && this.playerX <= gameObjPos[1][5][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][6][0] && this.playerX <= gameObjPos[1][6][0] + platformImg.width) {
                    if (this.vy < 0) {
                        this.vy *= -1;
                    }
                }
            }

            // top ledges
            if (this.playerY >= gameObjPos[1][0][1] + playerSize + platformImg.height &&
                this.playerY <= (gameObjPos[1][0][1] + playerSize + platformImg.height) * 1.04) {
                if (this.playerX >= gameObjPos[1][0][0] && this.playerX <= gameObjPos[1][0][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][1][0] && this.playerX <= gameObjPos[1][1][0] + platformImg.width ||
                    this.playerX >= gameObjPos[1][2][0] && this.playerX <= gameObjPos[1][2][0] + platformImg.width) {
                    if (this.vy < 0) {
                        this.vy *= -1;
                    }
                }
            }

            if (!this.jumping || this.vy > 1) {
                this.doorIndex = null;
                this.validDoorLocation = false;
            }
        }

        if (this.playerInsideRoom) {
            // Do nothing for now
        }

        // Bounching off ledges from side
        //if (this.playerY >= gameObjPos[1][3][1] && this.playerY <= gameObjPos[1][3][1] + platformImg.height) {
        //    console.log(this.playerX + playerSize);
        //    console.log(gameObjPos[1][3][0]);
        //    if (this.playerX + playerSize <= gameObjPos[1][3][0] && this.playerX + playerSize >= gameObjPos[1][3][0] * 0.95) {
        //        this.vx *= -1;
        //    }
        //}

        this.drawPlayer();
    };
}

function gameAnimation() {
    gameHandler = window.requestAnimationFrame(gameAnimation);

    player.update();
}

// function to write text for when it is possible to enter room
function writeEnterRoomText(posX, posY) {
    var enterRoomText = "Enter Room (E)";
    var measureEnterRoomText = playerCtx.measureText(enterRoomText).width;
    var displacementX = 30;
    var displacementY = 10;
    playerCtx.font = "bold 16px Arial";
    playerCtx.fillStyle = "white";
    playerCtx.fillRect(posX + displacementX - 2 , posY - displacementY, measureEnterRoomText + 4, 30);
    playerCtx.fillStyle = "black";
    playerCtx.fillText(enterRoomText, posX + displacementX, posY + displacementY);
    playerCtx.strokeStyle = "black";
    playerCtx.strokeRect(posX + displacementX - 2, posY - displacementY, measureEnterRoomText + 4, 30);
}

function enterRoom(roomChoice) {
    doorSound.play();
    roomCtx.clearRect(0, 0, roomCanvas.width, roomCanvas.height);
    var subjects;

        switch (roomChoice) {
            case 1:
                subjects = [];
                break;
            case 2:
                subjects = [];
                break;
            case 3:
                subjects = [];
                break;
            case 4:
                subjects = [];
                break;
            case 5:
                subjects = [];
                break;
            case 6:
                subjects = [];
                break;
            case 7:
                subjects = [];
                break;
    }


    drawRoom(subjects);
}


function drawRoom(roomSubjects) {
    var bookcasePosition;

    // Exit room text - bottom right corner
    var textToExitRoom = "Press E to exit room";
    var exitTextLength = roomCtx.measureText(textToExitRoom).width;
    roomCtx.font = "bold 16px Arial";
    roomCtx.fillStyle = "black";
    roomCtx.fillRect(roomCtx.width - exitTextLength - 32, roomCtx.height - 40, exitTextLength + 4, 30);
    roomCtx.fillStyle = "black";
    roomCtx.fillText(textToExitRoom, roomCtx.width - 10 - exitTextLength, roomCtx.height - 10);
    roomCtx.strokeStyle = "black";
    roomCtx.strokeRect(textToExitRoom, roomCtx.width - 10 - exitTextLength, roomCtx.height - 10, 30);

    //for (let i = 0; i < roomSubjects.length; i++) {
    //     Draw
    //}



    return bookcasePosition;
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

    if (soundMuted) {
        mutedBtn.innerText = "Unmute";
        soundMuted = false;
        GameArea.muteSound();
    }
    else {
        mutedBtn.innerText = "Mute";
        soundMuted = true;
        GameArea.unmuteSound();
    }
}

// Sound controls
function soundEffect(source) {
    this.sound = document.createElement("audio");
    this.sound.src = source;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };

    this.stopSound = function () {
        this.sound.pause();
        this.sound.currentTime = 0;
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
    var muteBtn = document.getElementById("soundBtn");

    if (sessionStorage.getItem("startedGame") == 1) {
        quitBtn.disabled = false;
        resetPlayerBtn.disabled = false;
        muteBtn.disabled = false;
        startBtn.disabled = true;
        $("#bodyColorSelecter").attr("disabled", false);
        $("#eyeColorSelecter").attr("disabled", false);
    }
    else {
        quitBtn.disabled = true;
        resetPlayerBtn.disabled = true;
        muteBtn.disabled = true;
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

function moveRoomCanvas() {
    var bckGroundCanvasLeft = gameCanvas.getBoundingClientRect().left;
    var bckGroundCanvasTop = gameCanvas.getBoundingClientRect().top;
    roomCanvas.style.left = bckGroundCanvasLeft + "px";
    roomCanvas.style.top = bckGroundCanvasTop + "px";
    roomCanvas.width = 850 * scale;
    roomCanvas.height = 458 * scale;
    roomCanvas.style.opacity = 1;
}