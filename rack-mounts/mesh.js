const { rectangle, roundedRectangle } = require('@jscad/modeling').primitives;
const { extrudeLinear } = require('@jscad/modeling').extrusions;
const { translate } = require('@jscad/modeling').transforms;
const { subtract, union, intersect } = require('@jscad/modeling').booleans;
const { polygon } = require('@jscad/modeling').primitives;

// Define the rack unit dimensions
const width = 195; // Width
const height = 180; // Height
const thickness = 3; // Plate thickness in mm
const wallThickness = 3; // Thickness of the hexagon walls
const sideLength = 10;  // Length of each side  of the hexagon
const cornerRadius = 10; // Corner radius of the mask
const framePadding = 10; // Padding between the frame and the honeycomb

const main = () => {
  return createHoneycombMesh(width, height, thickness, wallThickness, sideLength);
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
