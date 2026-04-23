// backend/dpLogic.js

// PROBLEM: Find min path sum in a grid from (0,0) to (m-1, n-1)
// MOVEMENT: Only Down or Right.

function solveMinPath(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    // dp[i][j] stores the min cost to reach cell (i, j)
    // We also need to store "how we got here" to reconstruct the path
    const dp = Array(rows).fill().map(() => Array(cols).fill(0));
    
    // Base Case: Top-Left cell cost is just its own value
    dp[0][0] = grid[0][0];

    // Initialize First Column (Can only come from above)
    for (let i = 1; i < rows; i++) {
        dp[i][0] = dp[i-1][0] + grid[i][0];
    }

    // Initialize First Row (Can only come from left)
    for (let j = 1; j < cols; j++) {
        dp[0][j] = dp[0][j-1] + grid[0][j];
    }

    // Fill the DP Table
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            // Take the minimum of coming from TOP (i-1, j) or LEFT (i, j-1)
            dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
        }
    }

    // --- RECONSTRUCT PATH (Backtracking from bottom-right) ---
    // This is crucial for the "Game" visual
    let path = [];
    let i = rows - 1;
    let j = cols - 1;

    path.push([i, j]); // Start at end

    while (i > 0 || j > 0) {
        if (i === 0) {
            j--; // Must go Left
        } else if (j === 0) {
            i--; // Must go Up
        } else {
            // Compare Top vs Left costs in DP table
            if (dp[i-1][j] < dp[i][j-1]) {
                i--; // Top was cheaper
            } else {
                j--; // Left was cheaper
            }
        }
        path.push([i, j]);
    }

    return {
        minCost: dp[rows-1][cols-1],
        path: path // Array of [row, col] coordinates
    };
}

module.exports = solveMinPath;