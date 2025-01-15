const { polygon } = require('@jscad/modeling').primitives;
const { extrudeLinear } = require('@jscad/modeling').extrusions;
const { snap } = require('@jscad/modeling').modifiers;
const { expand } = require('@jscad/modeling').expansions;
const { mirrorX, translate } = require('@jscad/modeling').transforms; // Include translate for positioning
const { union } = require('@jscad/modeling').booleans;

const createBridge = (gapWidth) => {
  const gapLength = 15;
  const gapDepth = 18;
  const bridgePillarThickness = 4;
  const bridgeMinThickness = 1;
  const bridgeMaxThickness = 3;
  const bridgeOverhang = 10;
  const bridgePeakXOffset = 6;
  const bridgeInnerPadding = 4;

  // Define half of the bridge profile
  const halfBridge = polygon({
    points: [
      [gapWidth / 2 - bridgePillarThickness, 0],
      [gapWidth / 2, 0],
      [gapWidth / 2, gapDepth],
      [gapWidth / 2 + bridgeOverhang, gapDepth],
      [gapWidth / 2 + bridgeOverhang, gapDepth + bridgeMinThickness],
      [gapWidth / 2 + bridgeOverhang - bridgePeakXOffset, gapDepth + bridgeMaxThickness],
      [0, gapDepth + bridgeMaxThickness],
      [0, gapDepth - bridgeInnerPadding],
      [gapWidth / 2 - bridgePillarThickness, gapDepth - bridgeInnerPadding],
    ],
  });

  // Perform a linear extrusion to create the 3D bridge
  const extrudedHalfBridge = extrudeLinear({
    height: gapLength, // Extrude along the Z-axis
  }, halfBridge);

  // Mirror the half-bridge to create the full bridge profile
  const mirroredHalf = mirrorX(extrudedHalfBridge);
  const fullBridge = union(extrudedHalfBridge, mirroredHalf); // Combine halves

  // Ensure the output is manifold for slicing
  return snap(0.1, fullBridge);
};

const main = () => {
  const gapWidths = Array.from({ length: 13 }, (_, i) => 15 + i * 0.5); // 15mm to 21mm with 0.5mm increments
  const xSpacing = 50; // Distance between models on X-axis (including margin)
  const ySpacing = 30; // Distance between rows
  const models = gapWidths.map((gapWidth, index) => {
    const row = Math.floor(index / 4); // 4 models per row
    const col = index % 4; // Column index
    const model = createBridge(gapWidth);
    return translate([col * xSpacing, row * ySpacing, 0], model); // Position with additional X margin
  });

  return models; // Return an array of positioned models
};

module.exports = { main };
