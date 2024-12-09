const { polygon } = require('@jscad/modeling').primitives;
const { extrudeRotate } = require('@jscad/modeling').extrusions;
const { translate } = require('@jscad/modeling').transforms;
const { snap } = require('@jscad/modeling').modifiers;

const main = () => {
  // Define parameters
  let outerHeight = 9;
  let outerDiameter = 60;
  let innerHeight = 7;
  let innerDiameter = 41.5;
  let topRimThickness = 3;

  // Computed values
  let innerRadius = innerDiameter / 2;
  let outerRadius = outerDiameter / 2;
  let bottomPadding = outerHeight - innerHeight;


  // Define a custom polygon shape with snapped points (e.g., a triangle)
  const myPolygon = polygon({
    points: [
      [0,0], 
      [outerRadius ,0], 
      [outerRadius, bottomPadding],
      [innerRadius + topRimThickness, outerHeight],
      [innerRadius, outerHeight],
      [innerRadius, bottomPadding],
      [0,bottomPadding]
    ]
  });

  // Optionally, move the polygon to align better with the rotation axis
  const movedPolygon = myPolygon;

  // Perform a rotational extrusion (circular extrusion)
  const myRotatedExtrusion = extrudeRotate({
    segments: 64, // Number of segments for smoothness
  }, movedPolygon);

  return snap([0.1], myRotatedExtrusion);
};

module.exports = { main };
