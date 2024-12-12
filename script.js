var Obj = function(x, y) {
    this.x = x;
    this.y = y;
    this.moving = {
        left: false,
        right: false,
        up: false,
        down: false
    };
};

Obj.prototype.rysuj = function() {
    var objHtml = '<img src="vyvu.png">';
    this.objElement = $(objHtml);

    this.objElement.css({
        position: "absolute",
        left: this.x,
        top: this.y,
        height: "20%",
        width: "5%",
    });

    $("body").append(this.objElement);
};

// Movement methods
Obj.prototype.wPrawo = function() {
    if (this.x + this.objElement.width() + 15 <= $(window).width()) {
        this.x += 15;
        this.objElement.css({
            left: this.x,
            top: this.y
        });
    }
};

Obj.prototype.wLewo = function() {
    if (this.x - 15 >= 0) {
        this.x -= 15;
        this.objElement.css({
            left: this.x,
            top: this.y
        });
    }
};

Obj.prototype.wGore = function() {
    if (this.y - 15 >= 0) {
        this.y -= 15;
        this.objElement.css({
            left: this.x,
            top: this.y
        });
    }
};

Obj.prototype.wDol = function() {
    if (this.y + this.objElement.height() + 15 <= $(window).height()) {
        this.y += 15;
        this.objElement.css({
            left: this.x,
            top: this.y
        });
    }
};

// Key event handling
var keysPressed = {};

$(document).keydown(function(event) {
    keysPressed[event.which] = true;

    // Start moving in the direction when a key is pressed
    if (keysPressed[37]) { // Left arrow
        fiat.moving.left = true;
    }
    if (keysPressed[38]) { // Up arrow
        fiat.moving.up = true;
    }
    if (keysPressed[39]) { // Right arrow
        fiat.moving.right = true;
    }
    if (keysPressed[40]) { // Down arrow
        fiat.moving.down = true;
    }

    event.preventDefault(); // Prevent the default action (e.g., scrolling)
});

$(document).keyup(function(event) {
    delete keysPressed[event.which];

    // Stop moving when the key is released
    if (event.which === 37) { // Left arrow
        fiat.moving.left = false;
    }
    if (event.which === 38) { // Up arrow
        fiat.moving.up = false;
    }
    if (event.which === 39) { // Right arrow
        fiat.moving.right = false;
    }
    if (event.which === 40) { // Down arrow
        fiat.moving.down = false;
    }
});

var Obj2 = function(x, y) {
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.targetX = 500;   // Punkt docelowy na osi X
    this.targetY = -500;   // Punkt docelowy na osi Y
    this.speed = 6;      // Prędkość obiektu (krok na klatkę)
    this.directionY = -1; // Kierunek ruchu w osi Y (-1 = w górę, 1 = w dół)
};

Obj2.prototype.rysuj = function() {
    var objHtml = '<img src="file.png">';
    this.objElement = $(objHtml);

    this.objElement.css({
        position: "absolute",
        left: this.x,
        top: this.y,
        width: "15%",
        height: "50%",
    });

    $("body").append(this.objElement);
};

Obj2.prototype.moveToTarget = function() {
    // Poruszanie w osi Y
    this.y += this.speed * this.directionY;

    // Sprawdzamy, czy obiekt dotyka górnej lub dolnej krawędzi ekranu
    if (this.y <= 0) {
        this.directionY = 1; // Odbicie w dół
        this.y = 0; // Ustawienie na krawędzi
    } else if (this.y + this.objElement.height() >= $(window).height()) {
        this.directionY = -1; // Odbicie w górę
        this.y = $(window).height() - this.objElement.height(); // Ustawienie na krawędzi
    }

    // Aktualizujemy pozycję na ekranie
    this.objElement.css({
        left: this.x,
        top: this.y
    });
};
function checkCollision(obj1, obj2) {
    var rect1 = {
        left: obj1.x,
        top: obj1.y,
        right: obj1.x + obj1.objElement.width(),
        bottom: obj1.y + obj1.objElement.height(),
    };
    var rect2 = {
        left: obj2.x,
        top: obj2.y,
        right: obj2.x + obj2.objElement.width(),
        bottom: obj2.y + obj2.objElement.height(),
    };

    // Check if the rectangles overlap
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

// Game loop to handle continuous movement when keys are pressed
function updateMovement() {
    if (fiat.moving.left) fiat.wLewo();
    if (fiat.moving.right) fiat.wPrawo();
    if (fiat.moving.up) fiat.wGore();
    if (fiat.moving.down) fiat.wDol();

    audi.moveToTarget();

    // Check for collision
    if (checkCollision(fiat, audi)) {
        endGame();
    }
}

// Function to end the game
function endGame() {
    // Display "Przegrałeś" message
    $("body").append('<div id="gameOver" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 48px; color: red;">Przegrałeś</div>');
    
    // Stop the game loop
    cancelAnimationFrame(gameLoopId);
}

var gameLoopId;

// Continuously update movement on every frame (using requestAnimationFrame for efficiency)
function gameLoop() {
    updateMovement();
    gameLoopId = requestAnimationFrame(gameLoop); // Call gameLoop again in the next frame
}

// Initialize objects
var fiat = new Obj(200, 200);
var audi = new Obj2(610, 980);
audi.targetX = 500;
audi.targetY = -500;

fiat.rysuj();
audi.rysuj();

gameLoop(); // Start the game loop