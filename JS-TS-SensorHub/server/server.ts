import * as express from 'express'
import ComputerBatterySensor from "./sensors/ComputerBatterySensor"
import ComputerTemperatureSensor from "./sensors/ComputerTemperatureSensor"
import ComputerCpuConsumptionSensor from "./sensors/ComputerCpuConsumptionSensor"
import ComputerRamUsageSensor from './sensors/ComputerRamConsumptionSensor'

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
app.get('/cpuLoad', async (req: express.Request, res: express.Response) => {
    try {
        const instance = new ComputerCpuConsumptionSensor( 3, "Test3" );
        var cpuLoad:number = await instance.getData()
        if (cpuLoad == -1) res.status(500).json({"error":"Failed to get battery percentage"});
        else {
            res.json({"response":cpuLoad});
        }
    } catch (err) {
        res.status(500).json({"error":err});
    }
});
app.get('/ramUsage', async (req: express.Request, res: express.Response) => {
    try {
        const instance = new ComputerRamUsageSensor( 2, "Test2" );
        var ramUsage:number = await instance.getData()
        if (ramUsage == -1) res.status(500).json({"error":"Failed to get battery percentage"});
        else {
            res.json({"response":ramUsage});
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