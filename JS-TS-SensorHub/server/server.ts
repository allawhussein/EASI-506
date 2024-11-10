import * as express from 'express'
import ComputerBatterySensor from "./sensors/ComputerBatterySensor"

const app = express();
app.use(express.static('public'));

app.get('/batteryPercentage', async (req: express.Request, res: express.Response) => {
    try {
        const instance = new ComputerBatterySensor( 1, "Test" );
        const batteryPercentage = await instance.getData()
        if (batteryPercentage == -1) res.status(500).json({"error":"Failed to get battery percentage"});
        else res.json({"response":batteryPercentage});
    } catch (err) {
        res.status(500).json({"error":err});
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

// Cleanup on exit
process.on('SIGINT', () => {
    process.exit();
});