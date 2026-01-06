# Git Graph Rendering Fixes

Summary of changes applied to `js/drawGraph.js` to improve rendering quality (post-commit `2d3c0e0cba9c1e5d3cf9825e8e7c4fa5d3d9efe5`).

## 1. Removed "Ghost Dots"
**Problem**: The "dummy points" used for initial positioning were drawn with `r="1"`, creating visible "bumps" under the connecting lines.
**Fix**: Changed the radius to `0` to make them invisible while preserving their positioning utility.

```javascript
/* js/drawGraph.js */
commitsGraphContainer.innerHTML += '<circle cx="' + ... + '" cy="' + yPos + '" r="0" ... />';
```

## 2. Optimized Vertical Lines
**Problem**: Vertical lines were being drawn as complex Bezier curves, which could result in rendering artifacts.
**Fix**: Modified `drawCurve` to detect vertical segments (`startx === endx`) and draw them using the simple SVG Line command (`L`).

```javascript
/* js/drawGraph.js */
if (startx === endx) {
  // Use Line command for perfect verticals
  container.innerHTML += '<path d = "M ' + startx + ' ' + starty + ' L ' + endx + ' ' + (endy + 1) + '" ... />';
}
```

## 3. Fixed Branch Thickening (Double Draw)
**Problem**: When a straight line and a curved branch originated from the same commit, the initial vertical segment was drawn twice (once for the straight line, once for the curve), causing that segment to appear darker/thicker.
**Fix**: Added logic to skip the initial vertical segment for the curved branch if a vertical parent already exists on the same line index.

```javascript
/* js/drawGraph.js */
var isVertical = (parent.lineIndex == commit.lineIndex);
var offsetStart = hasVerticalParent && !isVertical; 
drawCurve(..., offsetStart);

// In drawCurve:
var dStart = offsetStart 
  ? 'M ' + startx + ' ' + Math.floor(firstLineEndY) 
  : 'M ' + startx + ' ' + starty + ' L ' + startx + ' ' + Math.floor(firstLineEndY);
```

## 4. Fixed Vertical Seams & Sub-pixel Rendering
**Problem**: Sub-pixel rendering caused tiny gaps or overlapping dots where line segments joined.
**Fixes**:
*   **Integer Coordinates**: Applied `Math.floor()` to all coordinates (`startx`, `starty`, `endx`, `endy`) in `drawCurve`.
*   **Start Offset Adjustment**: Added `+ 1` to `starty` to ensure the line starts exactly where the previous segment ended, eliminating overlaps.
*   **End Extension**: Extended vertical line end position by 1px (`endy + 1`) to ensure it connects seamlessly with the next segment.

```javascript
/* js/drawGraph.js */
async function drawCurve(..., offsetStart = false) {
  startx = Math.floor(startx);
  starty = Math.floor(starty) + 1; // +1 to prevent start overlap
  endx = Math.floor(endx);
  endy = Math.floor(endy);
  
  if (startx === endx) {
     // ... L + endx + ' ' + (endy + 1) ...
  }
  // ...
}
```
