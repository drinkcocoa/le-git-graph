# PR: Fix Git Graph Rendering Artifacts and Overlapping Lines

## Overview
This PR addresses visual bugs in the Git Graph rendering where lines would overlap, causing specific branch lines to appear abnormally thick or dark. It also resolves an issue where dummy points used for coordinate calculations were visible as artifacts, and optimizes the rendering of vertical lines.

## Key Changes

### 1. Branch Thickening Fix
- **Symptom:** When a new branch splits from a commit, the initial vertical segment of the curved line was being drawn on top of the existing vertical branch line, causing that segment to appear double-thick or darker.
- **Fix:** 
  - Added an `offsetStart` parameter to the `drawCurve` function. When set to `true`, the function skips drawing the common starting vertical segment.
  - Improved the main loop logic to detect when a commit has both a "Vertical Parent" and a "Non-vertical Parent" (a split). In this case, `offsetStart=true` is passed for the branching curve.

### 2. Continuity Line Double-Drawing Fix
- **Symptom:** In the "Continuity" loop (which draws lines that pass through the current row), lines were being unnecessarily redrawn even when the current commit belonged to that line, resulting in darker overlapping segments.
- **Fix:** 
  - Added an `if (!isCommitOnLine)` check to the continuity loop.
  - If the current commit is part of the line index being processed, the connection has already been drawn by the parent connection loop. Therefore, we skip it in the continuity loop to prevent double rendering.

### 3. Vertical Line Optimization
- **Symptom:** Straight vertical lines were being drawn using complex Bezier curve (`C`) commands.
- **Fix:** 
  - Updated `drawCurve` to check if `startx === endx`. If they are the same, it uses a simple Line (`L`) command instead.
  - **Effect:** This removes unnecessary curve calculations and results in sharper, cleaner vertical lines.

---

## File Changes Summary
### `js/drawGraph.js`
- `drawCurve()`: Implemented straight-line optimization and `offsetStart` logic.
- `drawGraph()`: 
  - Added logic to check for `hasVerticalParent` and pass `offsetStart` in the parent connection loop.
  - Added `isCommitOnLine` check in the continuity loop to prevent duplicate drawing.
