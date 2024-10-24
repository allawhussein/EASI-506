const express = require('express');
const cors = require('cors');

const app = express();
const port = 9900;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Basic route
app.get('/getSensors', (req, res) => {
    const sensorReadings = [25, 28, 32, 12, 8]
    return res.status(200).json({ data: sensorReadings })
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
