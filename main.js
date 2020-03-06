const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size, shape) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
    this.shape = shape;
}

Ball.prototype = Object.create(Shape.prototype)
Object.defineProperty(Ball.prototype, 'constructor', {
    value: Ball,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
});

function EvilCircle(x, y, exists, color, size) {
    Shape.call(this, x, y, 20, 20, exists);
    this.color = color;
    this.size = size;
}

EvilCircle.prototype = Object.create(Shape.prototype)
Object.defineProperty(EvilCircle.prototype, 'constructor', {
    value: EvilCircle,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true
});

EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}


EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
        this.x = -(this.size);
    }

    if ((this.x - this.size) <= 0) {
        this.x = +(this.size);
    }

    if ((this.y + this.size) >= height) {
        this.y = -(this.size);
    }

    if ((this.y - this.size) <= 0) {
        this.y = +(this.size);
    }

}

EvilCircle.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                ballCount--;
            }
        }
    }
}


// passing the array function holding both eC1 and eC2 into this function which assigns keys to [0] and [1]

EvilCircle.prototype.setControls = function(array) {
    let eC1 = array[0];
    let eC2 = array[1];
    window.onkeydown = function(e) {
        if (e.key === 'a') {
            eC1.x -= eC1.velX;
        } else if (e.key === 'd') {
            eC1.x += eC1.velX;
        } else if (e.key === 'w') {
            eC1.y -= eC1.velY;
        } else if (e.key === 's') {
            eC1.y += eC1.velY;
        }
        if (e.key === 'g') {
            eC2.x -= eC2.velX;
        } else if (e.key === 'j') {
            eC2.x += eC2.velX;
        } else if (e.key === 'y') {
            eC2.y -= eC2.velY;
        } else if (e.key === 'h') {
            eC2.y += eC2.velY;
        }
    }
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

let balls = [];

while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        exists = true,
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size,
        "f1e2"
    );

    balls.push(ball);
}


let ballCount = balls.length;

let evilCircle1 = new EvilCircle(
    10,
    10,
    true,
    "green",
    10
);

let evilCircle2 = new EvilCircle(
    20,
    20,
    true,
    "red",
    10
)
let arr = [evilCircle1, evilCircle2]
evilCircle1.setControls(arr)
evilCircle2.setControls(arr)


function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    evilCircle1.draw();
    evilCircle1.checkBounds();
    evilCircle1.collisionDetect();
    evilCircle2.draw();
    evilCircle2.checkBounds();
    evilCircle2.collisionDetect();

    requestAnimationFrame(loop);

    document.getElementById("count").innerHTML = "Ball count: " + ballCount;

}

loop();