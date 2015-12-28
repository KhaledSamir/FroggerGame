// Enemies our player must avoid
var score = document.getElementById("score");
var Enemy = function (x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.orgLocation = x;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

var allEnemies = [];
for(var i = 50; i <= 220; i += 85) {
    var enemy = new Enemy(-50, i, i * 2);
    allEnemies.push(enemy);
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > ctx.canvas.width + 50)
        this.reset();
};

Enemy.prototype.reset = function () {
    this.x = this.orgLocation;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function (x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-princess-girl.png';
    this.orgLocation = {
        x: x,
        y: y
    }
};

Player.prototype.handleInput = function (key) {
    if (key == 'left' && player.x - 80 > 0)
        this.x -= 100;
    else if (key == 'right' && ctx.canvas.width - player.x > 200)
        this.x += 100;
    else if (key == 'up')
        this.y -= 90;
    else if (key == 'down' && ctx.canvas.height - player.y > 210 )
        this.y += 90;
};

function log(message){
    console.log(message)
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.update = function () {

    if (this.y < 0)
    {
        this.reset();
    }

};

Player.prototype.reset = function (collision) {
    
    this.x = this.orgLocation.x;
    this.y = this.orgLocation.y;
    if(collision)
        score.innerText = Number(score.innerText) - 5;
    else
        score.innerText = Number(score.innerText) + 5;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(300, 400);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// document.addEventListener('click',function () {
//     console.log('Player x is : ' + player.x);
//     console.log('Player y is : ' + player.y);
//     console.log('Enemy2 x is : ' + enemy2.x);
//     console.log('Enemy2 y is : ' + enemy2.y);
// })

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
