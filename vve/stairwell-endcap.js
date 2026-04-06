const { rectangle, roundedRectangle } = require('@jscad/modeling').primitives;
const { extrudeLinear } = require('@jscad/modeling').extrusions;
const { translate, rotate } = require('@jscad/modeling').transforms;
const { subtract, union, intersect } = require('@jscad/modeling').booleans;
const { cylinder } = require('@jscad/modeling').primitives;
const { polygon } = require('@jscad/modeling').primitives;
const { roundedCuboid, cuboid } = require('@jscad/modeling').primitives;

const capTopOverhang = 2.7; // Overhang of the top cap
const capTopHeight = 3; // Height of the top cap
const capInnerWidth = 64.4;
const capInnerHeight = 64.4;
const capDepth = 21.6; // Depth of the cap
const cornerRadius = 2.3; // Corner radius of the cap
const cutoutSideLength = 58; // Length of the cutout side
const cutoutCornerRadius = 2; // Corner radius of the cutout
const cutoutDepth = 18; // Depth of the cutout

const main = () => {

    const capTopSideLength = capInnerWidth + capTopOverhang * 2;

    const roundedCube = translate([0,0, capTopHeight], // move up to cover top half
        roundedCuboid({
            size: [capTopSideLength, capTopSideLength, capTopHeight * 2],
            roundRadius: cornerRadius,
            segments: 32
        })
    )

    var cuttingBox = translate([0, 0, capTopHeight / 2], // move up to cover top half
        cuboid({ size: [capTopSideLength, capTopSideLength, capTopHeight] }) // big enough to fully intersect
    );

    var halfCube = intersect(roundedCube, cuttingBox);

    var cutout = translate([0, 0, cutoutDepth + capTopHeight], // move up to cover top half
        roundedCuboid({
            size: [cutoutSideLength, cutoutSideLength, cutoutDepth * 2],
            roundRadius: cutoutCornerRadius,
            segments: 32
        })
    );

    var capTrunk = extrudeLinear({ height: capDepth + capTopHeight }, roundedRectangle({ size: [capInnerHeight, capInnerHeight], roundRadius: cornerRadius }));
    var cap = subtract(union(capTrunk, halfCube), cutout);
    return cap;

};

module.exports = { main };
