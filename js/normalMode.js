// Aman Mishra
// CST 2120
// 13/12/2023
// Coursework #1
//
// This is the main code that contains all the required functions to properly operate the game
// page, leaderboard page, and all necessary database interaction to effectively communicate
// between the two pages.

//-------------------------------------------------------------------------------------------------
//----------Game Variables-------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

// Constants
var SECONDSPERFRAME = 1000 / 60;
var FRAMEINTERVAL = 150;
var NUMBEROFPLAYERS = 5;

// Variables
var myGamePiece;
var myObstacles = [];
var wallMoveSpeed = 3;
var players = [];

//-------------------------------------------------------------------------------------------------
//----------Game Management------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

// Begin new game
function createGame() {
    // Create player object
    myGamePiece = new component(50, 20, "red", 10, 10);

    // Start game
    myGameArea.start();

    // Populate high score and personal best in scorebox.
    sortPlayersList();
    document.getElementById("hScore").innerText = getHighScore();
    getPersonalBest();
}

// Contains components to operate the canvas on which the game runs
var myGameArea = {
    // Gets the canvas on which the game will operate
    canvas: document.createElement("canvas"),

    // Constructs the game area and adds listeners
    start: function () {
        this.canvas.id = "gameCanvas";
        this.canvas.width = 880;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        var workFrame = document.getElementById("workFrame");
        workFrame.appendChild(this.canvas);

        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, SECONDSPERFRAME);

        window.addEventListener("mousemove", function (event) {
            myGameArea.x = event.offsetX;
            myGameArea.y = event.offsetY;
        });

        this.canvas.addEventListener("mouseenter", function () {
            myGameArea.canvasHover = true;
        });

        this.canvas.addEventListener("mouseleave", function () {
            myGameArea.canvasHover = false;
        });
    },

    // Wipes the canvas clean
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // Stops animating the canvas
    stop: function () {
        clearInterval(this.interval);
    },
};

// Creates game components like the playable character and obstacles and checks
// for collision between the playable character and obstacle walls
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;

    // Redraws the content everytime the canvas updates
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    //
    // this.newPos = function () {
    //     this.x -= this.speedX;
    //     this.y -= this.speedY;
    // };

    this.touches = function (wall) {
        var thisLeft = this.x;
        var thisRight = this.x + this.width;
        var thisTop = this.y;
        var thisBottom = this.y + this.height;

        var wallLeft = wall.x;
        var wallRight = wall.x + wall.width;
        var wallTop = wall.y;
        var wallBottom = wall.y + wall.height;

        var touch = true;

        if (
            thisBottom < wallTop ||
            thisTop > wallBottom ||
            thisRight < wallLeft ||
            thisLeft > wallRight
        ) {
            touch = false;
        }

        return touch;
    };
}

// Allows the creation of obstacle walls at different intervals based on the
// speed of the game at the moment
function everyInterval(n) {
    return (myGameArea.frameNo / n) % 1 == 0;
}

// Animates the game, draws a randomized wall, and updates the scoreboard
function updateGameArea() {
    var x;
    // Stop game on contact with any wall
    for (let i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.touches(myObstacles[i])) {
            myGameArea.stop();

            // Update userBest after setting up registration
            if (isSignedIn()) {
                user = JSON.parse(sessionStorage["loggedInUser"]);
                best = Math.max(user.best, myGameArea.frameNo + 1);
                user.best = best;

                // Update Display
                document.getElementById("pScore").innerHTML = best;

                // Update High Score by calling function getHighScore()
                document.getElementById("hScore").innerText = getHighScore();

                // Store to database
                userString = JSON.stringify(user);
                sessionStorage.setItem("loggedInUser", userString);
                localStorage[user.username] = userString;
            }
        }
    }

    // Reset canvas
    myGameArea.clear();

    // Create new wall
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyInterval(FRAMEINTERVAL / wallMoveSpeed)) {
        x = myGameArea.canvas.width;

        heightMax = 300;
        height = Math.floor(Math.random() * heightMax);

        gapMin = 100;
        gapMax = 200;
        gap = Math.floor(Math.random() * (gapMax - gapMin + 1) + gapMin);
        y = myGameArea.canvas.height - 200;

        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }

    // Update object coordinates and draw
    if (myGameArea.canvasHover && myGameArea.x && myGameArea.y) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = myGameArea.y;
    }

    myGamePiece.update();

    if (myGameArea.frameNo % 500 == 0) {
        wallMoveSpeed += 1;
    }
    for (let i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x -= wallMoveSpeed;
        myObstacles[i].update();
    }

    // Update score panel
    document.getElementById("cScore").innerText = myGameArea.frameNo;
}

//-------------------------------------------------------------------------------------------------
//---------Score Management------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

// Gets the personal best score of the currently logged in user
function isSignedIn() {
    return sessionStorage["loggedInUser"] != undefined;
}
function getPersonalBest() {
    personalBest = document.getElementById("pScore");
    if (isSignedIn()) {
        personalBest.innerHTML = JSON.parse(sessionStorage["loggedInUser"]).best;
    } else {
        personalBest.innerHTML = 0;
    }
}

// Gets the overall highest score of the game, Needle Threaders
function getHighScore() {
    if (players.length === 0) {
        return 0;
    }

    return players[0].best;
}

// Populates the leaderboard with the top X players
function populateTop5() {
    sortPlayersList();

    // This code will only print the top 5 or up to top 5 players.
    let playerCount = Math.min(localStorage.length, NUMBEROFPLAYERS);

    for (let i = 0; i < playerCount; i++) {
        printPlayer(players[i]);
    }
}

// Sorts the players' list in descending order
function sortPlayersList() {
    Object.keys(localStorage).forEach((username) => {
        let player = JSON.parse(localStorage[username]);
        players.push(player);
    });

    players.sort((a, b) => b.best - a.best);
}

// Receives a JSON object and prints it into the leaderboards table
function printPlayer(player) {
    playerRanks = document.getElementById("ranks");
    playerRanks.innerHTML +=
        "<tr><td>" +
        player.username +
        "</td><td>" +
        player.region +
        "</td><td>" +
        player.best +
        "</td></tr>";
}
