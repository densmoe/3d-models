const { polygon } = require('@jscad/modeling').primitives;
const { extrudeLinear } = require('@jscad/modeling').extrusions;
const { snap } = require('@jscad/modeling').modifiers;
const { expand } = require('@jscad/modeling').expansions;
const { mirrorX } = require('@jscad/modeling').transforms; // Use mirrorX for clarity
const { union } = require('@jscad/modeling').booleans;

const main = () => {
  const gapWidth = 18;
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

  // Add rounded corners to the full bridge profile
  const polyWithFillets = expand({
    delta: 0.5,         // Distance of offset
    corners: 'round',   // Use 'round' for fillets
  }, fullBridge);

  // Ensure the output is manifold for slicing
  return snap(0.1, fullBridge);
};

module.exports = { main };
