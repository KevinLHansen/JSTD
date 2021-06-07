import {
    Vector as Vector,
    Player as Player,
    Projectile as Projectile
} from "./modules/classes.mjs";

import {
    drawVector as drawVector
} from "./modules/functions.mjs";

const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

var now;
var fps;
var delta;

const debug = true;

var player;
var projectiles = [];

loop();

// GAME LOOP //

function loop() {
    setInterval(() => {
        requestAnimationFrame(render);
    }, 1000 / 60);
}

function render() {
    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    player.draw(ctx);

    // Draw projectiles
    projectiles.forEach((projectile) => {
        projectile.draw(ctx);
    });

    // Process player
    player.process(delta);

    // Process projectiles
    projectiles.forEach((projectile) => {
        projectile.process(delta);
    });

    // Debug drawing
    if (debug) {
        player.drawDebug(ctx);
    }

    // Manage timings
    delta = (performance.now() - now) / 1000;
    fps = Math.floor(1000 / delta);
    now = performance.now();
}

// EVENT LISTENERS //

window.addEventListener("click", (event) => {

    const vector = new Vector(event.x - player.x, event.y - player.y);
    const unitVector = vector.getUnitVector();

    projectiles.push(new Projectile(
        player.x + unitVector.x * (player.radius + 5),
        player.y + unitVector.y * (player.radius + 5),
        5,
        "white",
        unitVector,
        300
    ));
});

// Movement

window.addEventListener("keydown", (event) => {
    const key = event.code;

    if (key == "KeyW") {
        player.up = true;
    }
    if (key == "KeyA") {
        player.left = true;
    }
    if (key == "KeyS") {
        player.down = true;
    }
    if (key == "KeyD") {
        player.right = true;
    }
});

window.addEventListener("keyup", (event) => {
    const key = event.code;

    if (key == "KeyW") {
        player.up = false;
    }
    if (key == "KeyA") {
        player.left = false;
    }
    if (key == "KeyS") {
        player.down = false;
    }
    if (key == "KeyD") {
        player.right = false;
    }
});

player = new Player(200, 200, 25, "white", 5, 5);

requestAnimationFrame(render);