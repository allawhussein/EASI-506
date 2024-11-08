// Import required modules
const express = require('express');
const Gpio = require('onoff').Gpio;
const path = require('path');
// Initialize GPIO pins
const redLed = new Gpio(17, 'out');
const greenLed = new Gpio(27, 'out');
// Initialize Express app
const app = express();
app.use(express.static('public')); // Serve static files

// Route to turn the red LED on or off
app.get('/led/red/:state', (req, res) => {
    try{
        const state = req.params.state === 'on' ? 1 : 0;
        redLed.writeSync(state);
        res.status(200).send(`Red LED is ${req.params.state}`);
    }catch(err){
    res.status(500).send("Something went wrong", err);
    }
});
// Route to turn the green LED on or off
app.get('/led/green/:state', (req, res) => {
    const state = req.params.state === 'on' ? 1 : 0;
    greenLed.writeSync(state);
    res.send(`Green LED is ${req.params.state}`);
});
// Serve the control panel web page
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
// Cleanup on exit
process.on('SIGINT', () => {
redLed.unexport();
greenLed.unexport();
process.exit();
});