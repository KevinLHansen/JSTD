import {
    Vector as Vector,
    Player as Player,
    Projectile as Projectile
} from "./modules/classes.mjs";

import {
    drawVector as drawVector,
    log as log
} from "./modules/functions.mjs";

const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

var now;
var fps;
var delta;

var debug = false;

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
        projectile.process(ctx, delta);
    });

    // Debug drawing
    if (debug) {
        player.drawDebug(ctx);
        projectiles.forEach((projectile) => {
            projectile.drawDebug(ctx);
        });
    }

    // Purge dead entities
    purge();

    // Manage timings
    delta = (performance.now() - now) / 1000;
    fps = Math.floor(1000 / delta);
    now = performance.now();
}

// Purges "dead" entities
function purge() {
    // Purge projectiles
    for (let i = 0; i < projectiles.length; i++) {
        const projectile = projectiles[i];
        if (projectile.isDead) {
            projectiles.splice(i, 1);
        }
    }
}

// EVENT LISTENERS //

window.addEventListener("click", (event) => {

    const direction = new Vector(event.x - player.x, event.y - player.y).getUnitVector();

    projectiles.push(new Projectile(
        player.x + direction.x * (player.radius + 5),
        player.y + direction.y * (player.radius + 5),
        5,
        "white",
        direction,
        0.5,
        10,
        2
    ));
});

// Movement

window.addEventListener("keydown", (event) => {
    const key = event.code;

    if (key == "KeyW") { // UP
        player.up = true;
    }
    if (key == "KeyA") { // LEFT
        player.left = true;
    }
    if (key == "KeyS") { // DOWN
        player.down = true;
    }
    if (key == "KeyD") { // RIGHT
        player.right = true;
    }
    if (key == "Backquote") { // TOGGLE DEBUG
        debug = !debug;
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