import {
    Vector as Vector,
    Player as Player,
    Projectile as Projectile,
    TerrainObject as TerrainObject
} from "./modules/classes.mjs";

import {
    drawVector as drawVector,
    log as log,
    constructPath as constructPath
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

    terrain.draw(ctx);

    // Draw player
    player.draw(ctx);

    // Draw projectiles
    projectiles.forEach((projectile) => {
        projectile.draw(ctx);
    });

    // Draw debug
    if (debug) {
        ctx.font = "bold 12px arial";
        ctx.fillStyle = "white";
        ctx.fillText("width: " + canvas.width, 10, 15);
        ctx.fillText("height: " + canvas.height, 10, 30);
        player.drawDebug(ctx);
        projectiles.forEach((projectile) => {
            projectile.drawDebug(ctx);
        });
    }

    // Process player
    player.process(ctx, delta);

    // Process projectiles
    projectiles.forEach((projectile) => {
        projectile.process(ctx, delta);
    });

    // Purge dead entities
    purge();

    // Manage timings
    delta = (performance.now() - now) / 1000;
    fps = Math.floor(1000 / delta);
    now = performance.now();
}

// Purges "dead" entities
async function purge() {
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

var path = new Path2D();
constructPath(path, [
    { x: 0, y: 0 },
    { x: -200, y: 0 },
    { x: -25, y: 25 },
    { x: 0, y: 200 },
    { x: 25, y: 25 },
    { x: 200, y: 0 },
    { x: 25, y: -25 },
    { x: 0, y: -200 },
    { x: -25, y: -25 },
    { x: -200, y: 0 },
    { x: 0, y: 0 },
    { x: -25, y: -25 },
    { x: 0, y: 0 },
    { x: 0, y: -200 },
    { x: 0, y: 0 },
    { x: 25, y: -25 },
    { x: 0, y: 0 },
    { x: 200, y: 0 },
    { x: 0, y: 0 },
    { x: 25, y: 25 },
    { x: 0, y: 0 },
    { x: 0, y: 200 },
    { x: 0, y: 0 },
    { x: -25, y: 25 }
]);

var terrain = new TerrainObject(canvas.width / 2, canvas.height / 2, path, "magenta");

requestAnimationFrame(render);