// creating array for randomizing color input for shapes
var colorArray = ["burlywood", "firebrick", "black"];

// creating array for circles and rectangles
var shapeArray = [];
var ctx;

// Constants
var animationCtx = initializeCanvas();
var amountOfShapes = 50;
var cirlceSpawnProbability = 0.7;
var startVelocity = 18;
var shapeSizeMax = 15;
var shapeSizeMin = 5;
var animationHandler = null;


function Circle(x, y, vy, radius, color) {
    this.x = x;
    this.y = y;
    this.vy = vy;
    this.radius = radius;
    this.color = color;

    this.draw = function () {
        animationCtx.beginPath();
        animationCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        animationCtx.fillStyle = this.color;
        animationCtx.fill();
    };

    this.update = function (index) {
        this.y -= this.vy;
        this.draw();
        if (this.y + this.radius < 0) {
            let randomObject = createNewRandomShape();
            shapeArray.splice(index, 1, randomObject);
        }
    };
}

function Square(x, y, vy, size, color) {
    this.x = x;
    this.y = y;
    this.vy = vy;
    this.size = size;
    this.color = color;

    this.draw = function () {
        animationCtx.beginPath();
        animationCtx.rect(this.x, this.y, this.size, this.size);
        animationCtx.fillStyle = this.color;
        animationCtx.fill();
    };

    this.update = function (index) {
        this.y -= this.vy;
        this.draw();
        if (this.y + this.size < 0) {
            let randomObject = createNewRandomShape();
            shapeArray.splice(index, 1, randomObject);
        }
    };
}

function getRandomColor() {
    color = colorArray[Math.floor(Math.random() * colorArray.length)];
    return color;
}

function createNewRandomShape() {
    var randomObject = new Object();
    var color = getRandomColor();
    var shapeSize = Math.random() * (shapeSizeMax - shapeSizeMin) + shapeSizeMin;
    var x = Math.random() * (window.innerWidth - shapeSize * 2);
    var y = Math.random() * (window.innerHeight - shapeSize * 2) + window.innerHeight / 2;
    var vy = (startVelocity - shapeSize) / 4;
    var randomizer = Math.random();
    if (randomizer <= cirlceSpawnProbability) {
        randomObject = new Circle(x, y, vy, shapeSize, color);
    }
    else {
        randomObject = new Square(x, y, vy, shapeSize, color);
    }
    return randomObject;
}

function initiateAnimation() {
    shapeArray = [];
    animationCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < amountOfShapes; i++) {
        var createRandomShape = createNewRandomShape();
        shapeArray.push(createRandomShape);
    }
    animate();
}

function animate() {
    animationHandler = window.requestAnimationFrame(animate);
    animationCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < shapeArray.length; i++) {
        shapeArray[i].update(i);
    }
}

function initializeCanvas() {
    var bckGroundcanvas = document.getElementById("bckGroundCanvas");
    bckGroundcanvas.width = window.innerWidth;
    bckGroundcanvas.height = window.innerHeight;
    animationCtx = bckGroundcanvas.getContext("2d");
    
    // Ensuring proper pixel size to avoid blurring
    scale = avoidBlurring(animationCtx);
    moveCanvas(bckGroundcanvas, scale, "-2", "fixed");
    // Resize on change of window size
    $(window).bind("resize", function () {
        bckGroundcanvas.height = window.innerHeight;
        bckGroundcanvas.width = window.innerWidth;
    });
    return animationCtx;
}

function moveCanvas(canvas, scale, index, positioning) {
    canvas.style.left = 0 + "px";
    canvas.style.top = 63 + "px";
    canvas.style.position = positioning;
    canvas.style.zIndex = index;
    canvas.width = canvas.width * scale;
    canvas.height = canvas.height * scale;
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

function stopAnimation() {

    if (sessionStorage.getItem("animation") == 0) {
        window.cancelAnimationFrame(animationHandler);
        animationCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

function startAnimation() {

    if (sessionStorage.getItem("animation") == 1) {
        initiateAnimation();
    }
}