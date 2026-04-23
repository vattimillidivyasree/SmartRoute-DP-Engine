// backend/server.js
const express = require('express');
const cors = require('cors');
const solveMinPath = require('./dpLogic');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/calculate-path', (req, res) => {
    // Expecting: { grid: [[1,3,1], [1,5,1], [4,2,1]] }
    const { grid } = req.body;

    if (!grid || grid.length === 0) {
        return res.status(400).json({ message: "Invalid Grid" });
    }

    try {
        const result = solveMinPath(grid);
        // Result contains { minCost, path }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Error calculating DP" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`DP Server running on port ${PORT}`));