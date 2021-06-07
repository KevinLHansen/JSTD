import { Vector } from "./classes.mjs";

export function drawVector(ctx, x, y, vector, color) {
    const lengthFactor = 15; // Factor for multiplying length of the vector for better visual

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    var vectorBase = new Vector(
        x + vector.x * lengthFactor,
        y + vector.y * lengthFactor
    );
    ctx.lineTo(vectorBase.x, vectorBase.y);

    // Calculate and draw first pointer line
    var vectorPointer1 = new Vector(
        Math.cos((vector.getAngleDeg() + 150) * Math.PI / 180),
        Math.sin((vector.getAngleDeg() + 150) * Math.PI / 180)
    );
    ctx.lineTo(
        vectorBase.x + vectorPointer1.x * 10,
        vectorBase.y + vectorPointer1.y * 10
    );
    // Calculate and draw second pointer line
    ctx.moveTo(vectorBase.x, vectorBase.y);
    var vectorPointer2 = new Vector(
        Math.cos((vector.getAngleDeg() + -150) * Math.PI / 180),
        Math.sin((vector.getAngleDeg() + -150) * Math.PI / 180)
    );
    ctx.lineTo(
        vectorBase.x + vectorPointer2.x * 10,
        vectorBase.y + vectorPointer2.y * 10
    );
    ctx.stroke();

    // Draw variables
    ctx.font = "bold 12px arial";
    ctx.fillStyle = color;
    ctx.fillText("x: " + vector.x.toFixed(3), vectorBase.x, vectorBase.y);
    ctx.fillText("y: " + vector.y.toFixed(3), vectorBase.x, vectorBase.y + 12);
}

export function log(arg) {
    console.log(`[${performance.now().toFixed(3)}]\t` + arg);
}