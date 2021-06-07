import {
    drawVector as drawVector,
    isOutsideCanvas as isOutsideCanvas,
    log as log
} from "./functions.mjs";

export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getLength() {
        // Pythagoras
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    setLength(length) {
        const newVector = this.getUnitVector();
        newVector.multiplyBy(length);
        this.x = newVector.x;
        this.y = newVector.y;
    }

    getAngleDeg() {
        const rad = Math.atan2(this.y, this.x);
        const deg = 180 * rad / Math.PI;
        return (360 + Math.round(deg)) % 360;
    }

    getAngleRad() {
        const rad = Math.atan2(this.y, this.x);
        return rad;
    }

    getUnitVector() {
        const length = this.getLength();
        if (length == 0) { // Don't divide by 0
            return new Vector(0, 0);
        } else {
            return new Vector(this.x / length, this.y / length);
        }
    }

    addVector(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    multiplyBy(factor) {
        this.x = this.x * factor;
        this.y = this.y * factor;
    }
}

export class Player {
    constructor(x, y, radius, color, maxSpeed, acceleration) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.acceleration = acceleration;
        this.velocity = new Vector(0, 0);
        this.maxSpeed = maxSpeed;
        // Movement
        this.up = false;
        this.left = false;
        this.down = false;
        this.right = false;

        this.upVector = new Vector(0, -this.maxSpeed);
        this.leftVector = new Vector(-this.maxSpeed, 0);
        this.downVector = new Vector(0, this.maxSpeed);
        this.rightVector = new Vector(this.maxSpeed, 0);
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.stroke();
    }

    drawDebug(ctx) {
        // Draw vectors
        if (this.up) { drawVector(ctx, this.x, this.y, this.upVector, "yellow") }
        if (this.left) { drawVector(ctx, this.x, this.y, this.leftVector, "yellow") }
        if (this.down) { drawVector(ctx, this.x, this.y, this.downVector, "yellow") }
        if (this.right) { drawVector(ctx, this.x, this.y, this.rightVector, "yellow") }
        if (this.velocity.getLength() > 0.1) { drawVector(ctx, this.x, this.y, this.velocity, "lime") }
        // Draw variables
        const offset = { x: this.x + this.radius, y: this.y + this.radius };
        const vertOffset = 12;
        ctx.font = "bold 12px arial";
        ctx.fillStyle = this.color;
        ctx.fillText("x: " + this.x.toFixed(3), offset.x, offset.y);
        ctx.fillText("y: " + this.y.toFixed(3), offset.x, offset.y + vertOffset);
    }

    process(ctx, delta) {

        var targetVector = new Vector(0, 0);

        if (this.up || this.left || this.down || this.right) { // Acceleration

            if (this.up) {
                targetVector.addVector(this.upVector);
            }
            if (this.left) {
                targetVector.addVector(this.leftVector);
            }
            if (this.down) {
                targetVector.addVector(this.downVector);
            }
            if (this.right) {
                targetVector.addVector(this.rightVector);
            }

            var vector = new Vector(
                targetVector.x - this.velocity.x,
                targetVector.y - this.velocity.y
            ).getUnitVector();

            vector.multiplyBy(this.acceleration * delta);
            this.velocity.addVector(vector);

            // So that diagonal movement doesnt exceed topspeed
            if (this.velocity.getLength() > this.maxSpeed) {
                this.velocity.setLength(this.maxSpeed);
            }

        } else { // Deacceleration

            if (this.velocity.x == 0 && this.velocity.y == 0) {
                // no thank you
            } else if (this.velocity.getLength() < 1) {
                this.velocity.x = 0;
                this.velocity.y = 0;
            } else {
                var vector = new Vector(
                    targetVector.x - this.velocity.x,
                    targetVector.y - this.velocity.y
                ).getUnitVector();

                vector.multiplyBy(this.acceleration * delta);
                this.velocity.addVector(vector);
            }
        }

        const newX = this.x + this.velocity.x;
        const newY = this.y + this.velocity.y;
        const topAndLeft = isOutsideCanvas(ctx, newX - this.radius, newY - this.radius);
        const bottomAndRight = isOutsideCanvas(ctx, newX + this.radius, newY + this.radius);
        if (topAndLeft.isOutside) {
            topAndLeft.sides.forEach((side) => {
                switch (side) {
                    case "top":
                        this.velocity.y = 0;
                        this.x = newX;
                        break;
                    case "left":
                        this.velocity.x = 0;
                        this.y = newY;
                        break;
                }
            })
        } else if (bottomAndRight.isOutside) {
            bottomAndRight.sides.forEach((side) => {
                switch (side) {
                    case "bottom":
                        this.velocity.y = 0;
                        this.x = newX;
                        break;
                    case "right":
                        this.velocity.x = 0;
                        this.y = newY;
                        break;
                }
            })
        } else {
            this.x = newX;
            this.y = newY;
        }
    }
}

export class Projectile {
    constructor(x, y, radius, color, direction, startSpeed, maxSpeed, acceleration) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.direction = direction;
        this.startSpeed = startSpeed;
        this.maxSpeed = maxSpeed;
        this.acceleration = acceleration;
        this.velocity = new Vector(
            direction.x * startSpeed,
            direction.y * startSpeed
        );
        this.isDead = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    drawDebug(ctx) {
        // Draw vector
        drawVector(ctx, this.x, this.y, this.velocity, "lime");

        // Draw variables
        const offset = { x: this.x + this.radius, y: this.y + this.radius };
        const vertOffset = 12;
        ctx.font = "bold 12px arial";
        ctx.fillStyle = this.color;
        ctx.fillText("x: " + this.x.toFixed(3), offset.x, offset.y);
        ctx.fillText("y: " + this.y.toFixed(3), offset.x, offset.y + vertOffset);
    }

    process(ctx, delta) {
        // Process destruction
        this.isDead = isOutsideCanvas(ctx, this.x, this.y).isOutside;

        // Process movement
        this.velocity.multiplyBy(1 + Math.pow(this.acceleration, 2) * delta);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

export class TerrainObject {
    constructor(x, y, path, color) {
        this.x = x;
        this.y = y;
        this.path = path;
        this.color = color;
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.transform(1, 0, 0, 1, this.x, this.y);
        ctx.stroke(this.path);
        ctx.resetTransform();
    }
}