import * as express from 'express'
import ComputerBatterySensor from "./sensors/ComputerBatterySensor"
import ComputerTemperatureSensor from "./sensors/ComputerTemperatureSensor"
import { cp } from 'fs';

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
app.get('/cpuTemperature', async (req: express.Request, res: express.Response) => {
    try {
        const instance = new ComputerTemperatureSensor( 2, "Test2" );
        var cpuTemperature:number = await instance.getData()
        if (cpuTemperature == -1) res.status(500).json({"error":"Failed to get battery percentage"});
        else {
            cpuTemperature = cpuTemperature / 10 - 273;
            res.json({"response":cpuTemperature});
        }
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