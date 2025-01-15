const { rectangle, roundedRectangle } = require('@jscad/modeling').primitives;
const { extrudeLinear } = require('@jscad/modeling').extrusions;
const { translate, rotate } = require('@jscad/modeling').transforms;
const { subtract, union, intersect } = require('@jscad/modeling').booleans;
const { cylinder } = require('@jscad/modeling').primitives;
const { polygon } = require('@jscad/modeling').primitives;

// Define the rack unit dimensions
const uHeight = 3; // Number of rack units
const oneU = 44.45; // 1U height in mm

const rackInnerWidth = 222.25; // 8.75 inches in mm
const rackRailWidth = 15.875; // 0.625 inches in mm
const rackRailScrewholeDistance = 15.875; // 0.625 inches in mm
const rackWidth = rackInnerWidth + rackRailWidth * 2; // Total width of the rack in mm
const rackHeight = oneU * uHeight; // 1U height in mm
const thickness = 4; // Plate thickness in mm
const holeDiameter = 6; // Screw hole diameter in mm

// Slots for the mini pcs
const miniPcWidth = 115;
const miniPcHeight = 46.5 + 0.3; // hiegh includes the rubber feet and 0.5 tolerace
const miniPcDepth = 107;
const miniPcCornerRadius = 10;
const slotMargin = 25;
const slotWallThickness = 4;
const slotDepth = miniPcDepth - miniPcCornerRadius + slotWallThickness;

//dimensions of a keystone jack
const keystoneWidth = 16.5;
const keystoneHeight = 14.5;

const main = () => {
  

  // Create the inner base plate
  const innerFacePlate = extrudeLinear({ height: thickness }, rectangle({ size: [rackInnerWidth, rackHeight] }));

  // Add rackrails
  const rackRailOffset = (rackWidth - rackRailWidth) / 2;
  const leftRackRail = rackRail(uHeight, -rackRailOffset, thickness);
  const rightRackRail = rackRail(uHeight, rackRailOffset, thickness);
  var facePlate = union(innerFacePlate, leftRackRail, rightRackRail);

  // SLots for the mini pcs
  const slotOffset = miniPcHeight + slotMargin;
  const centerSlot = miniPcSlot(0);
  const leftSlot = miniPcSlot(-slotOffset);
  const rightSlot = miniPcSlot(slotOffset);
  facePlate = subtract(facePlate, centerSlot, leftSlot, rightSlot);

  var slot = extrudeLinear({ height: slotDepth }, roundedRectangle({ size: [miniPcHeight + slotWallThickness * 2, miniPcWidth + slotWallThickness * 2], roundRadius: 4 }));
  slot = translate([-10, 0], slot);
  var miniPcMask = extrudeLinear({ height: miniPcHeight }, roundedRectangle({ size: [miniPcDepth, miniPcWidth], roundRadius: miniPcCornerRadius, center: [0,0]}));
  miniPcMask = translate([0, 0, -miniPcHeight/2], miniPcMask);
  // rotate the mask to fit the mini pc slot
  miniPcMask = rotate([0, Math.PI / 2, 0], miniPcMask);
  miniPcMask = translate([-10, 0, miniPcDepth / 2 - miniPcCornerRadius], miniPcMask );

  // extruded rounded rectangle to cut out the back panel
  var backPanelCutoutMask = extrudeLinear({ height: miniPcDepth + 20 }, roundedRectangle({ size: [miniPcHeight - 10, miniPcWidth - 10], roundRadius: 5, center: [0,0]}));
  backPanelCutoutMask = translate([-10, 0, 0], backPanelCutoutMask);

  const maskThickness = 70;
  var meshMask = createHoneycombMeshMask( miniPcDepth - 25, miniPcWidth - 15, maskThickness, 2, 5, 5);
  meshMask = translate([0, 0, -maskThickness / 2], meshMask);
  meshMask = rotate([0, Math.PI / 2, 0], meshMask);
  meshMask = translate([-10, 0, slotDepth / 2 + thickness], meshMask);

  const maskThickness2 = miniPcWidth + 20;
  var sidePanelCutoutMask = extrudeLinear({ height: maskThickness2 }, roundedRectangle({ size: [miniPcHeight - 10, miniPcDepth - 25], roundRadius: 5, center: [0,0]}));
  sidePanelCutoutMask = translate([0, 0, -maskThickness2 / 2], sidePanelCutoutMask);
  sidePanelCutoutMask = rotate([Math.PI / 2, 0, 0], sidePanelCutoutMask);
  sidePanelCutoutMask = translate([-10, 0, slotDepth / 2], sidePanelCutoutMask);

  slot = subtract(slot, miniPcMask, centerSlot, backPanelCutoutMask, meshMask, sidePanelCutoutMask);

  // Left slot
  var slotLeft = extrudeLinear({ height: slotDepth }, roundedRectangle({ size: [miniPcHeight + slotWallThickness * 2, miniPcWidth + slotWallThickness * 2], roundRadius: 4 }));
  slotLeft = translate([-10 -slotOffset, 0], slotLeft);
  var miniPcMaskLeft = extrudeLinear({ height: miniPcHeight }, roundedRectangle({ size: [miniPcDepth, miniPcWidth], roundRadius: miniPcCornerRadius, center: [0,0]}));
  miniPcMaskLeft = translate([0, 0, -miniPcHeight/2], miniPcMaskLeft);
  // rotate the mask to fit the mini pc slot
  miniPcMaskLeft = rotate([0, Math.PI / 2, 0], miniPcMaskLeft);
  miniPcMaskLeft = translate([-10 - slotOffset, 0, miniPcDepth / 2 - miniPcCornerRadius], miniPcMaskLeft );

  var backPanelCutoutMaskLeft = extrudeLinear({ height: miniPcDepth + 20 }, roundedRectangle({ size: [miniPcHeight - 10, miniPcWidth - 10], roundRadius: 5, center: [0,0]}));
  backPanelCutoutMaskLeft = translate([-10 -slotOffset, 0, 0], backPanelCutoutMaskLeft);

  var meshMaskLeft = createHoneycombMeshMask( miniPcDepth - 25, miniPcWidth - 15, maskThickness, 2, 5, 5);
  meshMaskLeft = translate([0, 0, -maskThickness / 2], meshMaskLeft);
  meshMaskLeft = rotate([0, Math.PI / 2, 0], meshMaskLeft);
  meshMaskLeft = translate([-10 - slotOffset, 0, slotDepth / 2 + thickness], meshMaskLeft);

  var sidePanelCutoutMaskLeft = extrudeLinear({ height: maskThickness2 }, roundedRectangle({ size: [miniPcHeight - 10, miniPcDepth - 25], roundRadius: 5, center: [0,0]}));
  sidePanelCutoutMaskLeft = translate([0, 0, -maskThickness2 / 2], sidePanelCutoutMaskLeft);
  sidePanelCutoutMaskLeft = rotate([Math.PI / 2, 0, 0], sidePanelCutoutMaskLeft);
  sidePanelCutoutMaskLeft = translate([-10 -slotOffset, 0, slotDepth / 2], sidePanelCutoutMaskLeft);

  slotLeft = subtract(slotLeft, miniPcMaskLeft, leftSlot, backPanelCutoutMaskLeft, meshMaskLeft, sidePanelCutoutMaskLeft);

  // Right slot
  var slotRight = extrudeLinear({ height: slotDepth }, roundedRectangle({ size: [miniPcHeight + slotWallThickness * 2, miniPcWidth + slotWallThickness * 2], roundRadius: 4 }));
  slotRight = translate([-10 + slotOffset , 0], slotRight);
  var miniPcMaskRight = extrudeLinear({ height: miniPcHeight }, roundedRectangle({ size: [miniPcDepth, miniPcWidth], roundRadius: miniPcCornerRadius, center: [0,0]}));
  miniPcMaskRight = translate([0, 0, -miniPcHeight/2], miniPcMaskRight);
  // rotate the mask to fit the mini pc slot
  miniPcMaskRight = rotate([0, Math.PI / 2, 0], miniPcMaskRight);
  miniPcMaskRight = translate([-10 + slotOffset, 0, miniPcDepth / 2 - miniPcCornerRadius], miniPcMaskRight );

  var backPanelCutoutMaskRight = extrudeLinear({ height: miniPcDepth + 20 }, roundedRectangle({ size: [miniPcHeight - 10, miniPcWidth - 10], roundRadius: 5, center: [0,0]}));
  backPanelCutoutMaskRight = translate([-10 + slotOffset , 0, 0], backPanelCutoutMaskRight);

  var meshMaskRight = createHoneycombMeshMask( miniPcDepth - 25, miniPcWidth - 15, maskThickness, 2, 5, 5);
  meshMaskRight = translate([0, 0, -maskThickness / 2], meshMaskRight);
  meshMaskRight = rotate([0, Math.PI / 2, 0], meshMaskRight);
  meshMaskRight = translate([-10 + slotOffset, 0, slotDepth / 2 + thickness], meshMaskRight);

  var sidePanelCutoutMaskRight = extrudeLinear({ height: maskThickness2 }, roundedRectangle({ size: [miniPcHeight - 10, miniPcDepth - 25], roundRadius: 5, center: [0,0]}));
  sidePanelCutoutMaskRight = translate([0, 0, -maskThickness2 / 2], sidePanelCutoutMaskRight);
  sidePanelCutoutMaskRight = rotate([Math.PI / 2, 0, 0], sidePanelCutoutMaskRight);
  sidePanelCutoutMaskRight = translate([-10 + slotOffset , 0, slotDepth / 2], sidePanelCutoutMaskRight);

  slotRight = subtract(slotRight, miniPcMaskRight, rightSlot, backPanelCutoutMaskRight, meshMaskRight, sidePanelCutoutMaskRight);

  // Return the final geometry
  return union(facePlate, slot, slotLeft, slotRight);
};

// function to generate rackrail
const rackRail = (numberOfSections = 1, xOffset = 0, thickness) => {
  var railSection = extrudeLinear({ height: thickness }, rectangle({ size: [rackRailWidth, oneU] }));
  const centerScrewHole = cylinder({ height: thickness * 2, radius: holeDiameter / 2 });
  const topScrewHole = translate([0, rackRailScrewholeDistance], centerScrewHole);
  const bottomScrewHole = translate([0, -rackRailScrewholeDistance], centerScrewHole);
  railSection = subtract(railSection, centerScrewHole, topScrewHole, bottomScrewHole);

  // generate and union multiple sections using a map lambda function based on the number of sections
  return union(...Array(numberOfSections).fill().map((_, i) => {
    return translate([xOffset, (i - ((numberOfSections - 1) / 2)) * oneU], railSection);
  }));
}; 

// function to generate slots for the mini pcs
const miniPcSlot = (xOffset = 0) => {
  var slot = extrudeLinear({ height: thickness }, rectangle({ size: [miniPcHeight, miniPcWidth] }));
  slot = translate([xOffset, 0], slot);

  // Slots for the keystone jacks
  var keystoneSlot = extrudeLinear({ height: thickness }, rectangle({ size: [keystoneHeight, keystoneWidth] }));
  keystoneSlot = translate([xOffset + 26 , 0], keystoneSlot);
  slot = translate([-10, 0], slot);

  // return union(slot, keystoneSlot);
  return union(slot);
};

// function to create a honeycomb mesh
function createHoneycombMesh(width, height, thickness, wallThickness, sideLength) {
  const plane = extrudeLinear({ height: thickness }, rectangle({ size: [width, height] }));
  const honeycomb = createHoneycombMeshMask(width - framePadding, height - framePadding, thickness, wallThickness, sideLength, cornerRadius);
  return subtract(plane, union(honeycomb));
}

// function to create a honeycomb mask
function createHoneycombMeshMask(width, height, thickness, wallThickness, sideLength, cornerRadius = 0) {
  const hexHeight = Math.sqrt(3) * sideLength; // Height of a hexagon
  const hexWidth = 2 * sideLength;            // Width of a hexagon
  
  const ySpacing = wallThickness; // spacing between hexagons (both vertical and horizontal)
  const xSpacing = -(sideLength / 2 - ySpacing * Math.sqrt(3) / 2) ;
  let rows = Math.round(height / (hexHeight + ySpacing));         // Number of rows in the honeycomb
  let cols = Math.round(width / (hexWidth + xSpacing));         // Number of columns in the honeycomb

  rows += (rows % 2 === 0) ? 2 : 3;
  cols += (cols % 2 === 0) ? 2 : 3;

  let honeycomb = [];
  
  // Loop through rows and columns
  for (let row = -rows/2; row < rows/2; row++) {
      for (let col = -cols/2; col < cols/2; col++) {

        // Offset alternate rows
        let x = col * (hexWidth + xSpacing);
        let yOffset = (col % 2 === 0) ? 0 : hexHeight / 2 + ySpacing / 2;
        let y = row * (hexHeight + ySpacing) + yOffset;
        const hexHole = extrudeLinear({ height: thickness }, createHexagon(sideLength));
        const hex = translate([x, y, 0], hexHole)
        honeycomb.push(hex);
      }
  }

  // generate extruded rounded rectangle to mask the honeycomb
  const mask = extrudeLinear({ height: thickness }, roundedRectangle({ size: [width, height], roundRadius: cornerRadius }));

  return intersect(union(honeycomb), mask);
}

// Function to create a 2D hexagon
function createHexagon(sideLength) {
  return polygon({
      points: createHexagonPoints(sideLength)
  });
}

// Function to calculate hexagon vertices
function createHexagonPoints(sideLength) {
  let points = [];
  for (let i = 0; i < 6; i++) {
      let angle = Math.PI / 3 * i;  // 60 degrees in radians
      let x = Math.cos(angle) * sideLength;
      let y = Math.sin(angle) * sideLength;
      points.push([x, y]);
  }
  return points;
}


module.exports = { main };
