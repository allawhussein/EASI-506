const express = require('express');
const bodyParser = require('body-parser');
const Gpio = require('onoff').Gpio;
const sensor = require('node-dht-sensor');
const cors = require('cors');  // Import CORS

// Initialize Express app
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());  // Enable CORS for all routes

// Use JSON parser for POST requests
app.use(bodyParser.json());

// Define GPIO pins
const WATER_PUMP_PIN = 17;      // Pin for water pump relay
const VALVE_PIN = 16;           // Pin for valve relay
const TRIGGER_PIN = 22;         // Pin for ultrasonic sensor trigger
const ECHO_PIN = 23;            // Pin for ultrasonic sensor echo
const LDR_PIN = 6;             // Pin for Light Dependent Resistor (LDR)
const DHT_PIN = 5;              // Pin for DHT sensor (humidity and temperature)

// Initialize GPIO pins
let waterPumpRelay = new Gpio(WATER_PUMP_PIN, 'out');
let valveRelay = new Gpio(VALVE_PIN, 'out');
let trigger = new Gpio(TRIGGER_PIN, 'out');
let echo = new Gpio(ECHO_PIN, 'in', 'both');
let ldrPin = new Gpio(LDR_PIN, 'in', 'both');

// Define thresholds
const LOW_WATER_LEVEL_THRESHOLD = 10;    // cm
const HIGH_WATER_LEVEL_THRESHOLD = 30;   // cm
let humidityThreshold = 40;              // Humidity threshold for automatic valve control
const LDR_LIGHT_THRESHOLD = 500;         // Light level threshold for valve control
let currentMode = 'manual';  // Default to manual mode

// Function to measure water level using ultrasonic sensor
const measureWaterLevel = () => {
  return new Promise((resolve, reject) => {
    let startTime, endTime;
    trigger.writeSync(1);
    setTimeout(() => trigger.writeSync(0), 10);

    echo.watch((err, value) => {
      if (err) {
        echo.unwatchAll();
        return reject('Error reading water level: ' + err);
      }

      if (value === 1) {
        startTime = process.hrtime();
      } else if (value === 0) {
        endTime = process.hrtime(startTime);
        const duration = endTime[0] * 1e9 + endTime[1]; // Convert to nanoseconds
        const distance = duration / 58; // Convert to cm
        distance= 100-distance;
        echo.unwatchAll();
        console.log(`Measured water level: ${distance} cm`);
        resolve(distance);
      }
    });
  });
};

// Function to read humidity and temperature
const readHumidityAndTemp = () => {
  return new Promise((resolve, reject) => {
    sensor.read(22, DHT_PIN, (err, temperature, humidity) => {
      if (err) {
        reject('Error reading humidity: ' + err);
      } else {
        console.log(`Temperature: ${temperature}°C, Humidity: ${humidity}%`);
        resolve({ temperature, humidity });
      }
    });
  });
};

// Function to read LDR (light level)
const readLDRValue = () => {
  return new Promise((resolve, reject) => {
    ldrPin.read((err, value) => {
      if (err) {
        reject('Error reading LDR value: ' + err);
      } else {
        console.log(`LDR Value: ${value}`);
        resolve(value);  // 0 means high light, 1 means low light
      }
    });
  });
};

// API to set the humidity threshold
app.post('/api/set-humidity-threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold && !isNaN(threshold)) {
    humidityThreshold = parseInt(threshold);
    console.log(`Humidity threshold set to ${humidityThreshold}%`);
    res.send(`Humidity threshold set to ${humidityThreshold}%`);
  } else {
    res.status(400).send('Invalid threshold value.');
  }
});

// API to control water pump manually or automatically
app.post('/api/water-pump', async (req, res) => {
  const { action, mode } = req.body;
  
  // Check if the mode is specified and set the mode
  if (mode) {
    currentMode = mode;  // Set mode to manual or automatic
    console.log(`Mode changed to: ${currentMode}`);
  }

  // Log the action being taken
  console.log(`Water pump action: ${action}, Current mode: ${currentMode}`);

  if (currentMode === 'manual') {
    // Manual control
    if (action === 'on') {
      try {
        const waterLevel = await measureWaterLevel();
        console.log(`Current water level: ${waterLevel} cm`);

        if (waterLevel >= HIGH_WATER_LEVEL_THRESHOLD) {
          return res.status(400).send('Water level is too high. Pump cannot be turned on.');
        }

        waterPumpRelay.writeSync(1); // Turn on the pump
        res.send('Water pump turned on.');
      } catch (error) {
        res.status(500).send('Error checking water level: ' + error.message);
      }
    } else if (action === 'off') {
      waterPumpRelay.writeSync(0); // Turn off the pump
      res.send('Water pump turned off.');
    } else {
      res.status(400).send('Invalid action. Use "on" or "off".');
    }
  } else if (currentMode === 'automatic') {
    // Automatic control based on water level
    try {
      const waterLevel = await measureWaterLevel();
      console.log(`Current water level: ${waterLevel} cm`);

     if (waterLevel >= HIGH_WATER_LEVEL_THRESHOLD) {
        waterPumpRelay.writeSync(0); // Turn off the pump
        res.send('Water pump turned off automatically (high water level).');
      } else {
        waterPumpRelay.writeSync(1); // Turn on the pump
        res.send('Water pump turned on automatically.');
      }
    } catch (error) {
      res.status(500).send('Error checking water level: ' + error.message);
    }
  } else {
    res.status(400).send('Invalid mode. Use "manual" or "automatic".');
  }
});


// API to control hydration valve manually or automatically
app.post('/api/hydration-valve', async (req, res) => {
  const { action, mode } = req.body;
  
  // Check if the mode is specified and set the mode
  if (mode) {
    currentMode = mode;  // Set mode to manual or automatic
    console.log(`Mode changed to: ${currentMode}`);
  }

  // Log the action being taken
  console.log(`Hydration valve action: ${action}, Current mode: ${currentMode}`);

  if (currentMode === 'manual') {
    // Manual control
    if (action === 'on') {
      try {
        const waterLevel = await measureWaterLevel();
        const { humidity } = await readHumidityAndTemp();
        console.log(`Current water level: ${waterLevel} cm, Humidity: ${humidity}%`);

        if (waterLevel < LOW_WATER_LEVEL_THRESHOLD) {
          return res.status(400).send('Water level is too low. Valve cannot be turned on.');
        }

        valveRelay.writeSync(1); // Turn on the valve
        res.send('Hydration valve turned on.');
      } catch (error) {
        res.status(500).send('Error checking water level or humidity: ' + error.message);
      }
    } else if (action === 'off') {
      valveRelay.writeSync(0); // Turn off the valve
      res.send('Hydration valve turned off.');
    } else {
      res.status(400).send('Invalid action. Use "on" or "off".');
    }
  } else if (currentMode === 'automatic') {
    // Automatic control based on water level and humidity
    setInterval(() => {
      controlHydrationValveWithLight();
      controlHydrationValveWithHumidity();
      controlHydrationValveWithWaterLevel();
    }, 1000);  // Check every 1 second
    
    
  } else {
    res.status(400).send('Invalid mode. Use "manual" or "automatic".');
  }
});

// API to measure water level
app.get('/api/water-level', async (req, res) => {
  try {
    const distance = await measureWaterLevel();
    console.log(`Measured water level: ${distance} cm`);
    res.json({ distance });
  } catch (error) {
    res.status(500).send('Error reading water level: ' + error.message);
  }
});

// API to read humidity and temperature
app.get('/api/humidity', async (req, res) => {
  try {
    const { temperature, humidity } = await readHumidityAndTemp();
    console.log(`Temperature: ${temperature}°C, Humidity: ${humidity}%`);
    res.json({ temperature, humidity });
  } catch (error) {
    res.status(500).send('Error reading humidity and temperature: ' + error.message);
  }
});

// API to read LDR (light level)
app.get('/api/ldr', async (req, res) => {
  try {
    const value = await readLDRValue();
    console.log(`LDR Value: ${value}`);
    res.json({ ldrValue: value });
  } catch (error) {
    res.status(500).send('Error reading LDR value: ' + error.message);
  }
});

// Clean up GPIO on exit
process.on('SIGINT', () => {
  waterPumpRelay.unexport();
  valveRelay.unexport();
  trigger.unexport();
  echo.unexport();
  ldrPin.unexport();
  console.log('Exiting...');
  process.exit();
});


// Function to control hydration valve based on water level
const controlHydrationValveWithWaterLevel = async () => {
  try {
    // Get the current water level
    const waterLevel = await measureWaterLevel();  
    console.log(`Current water level: ${waterLevel} cm`);

   // If the water level is below the low threshold, turn on the valve
    if (waterLevel > LOW_WATER_LEVEL_THRESHOLD) {
      valveRelay.writeSync(1);  
      console.log("Water level is High, hydration valve turned on.");
    } else { 
      valveRelay.writeSync(0);  
      console.log("Water level is low, hydration valve turned off.");
    } 
  } catch (error) {
    console.log("Error reading water level: " + error.message);
  }
};

// Function to control hydration valve based on light (LDR)
const controlHydrationValveWithLight = async () => {
  try {
    const ldrValue = await readLDRValue();
    console.log(`LDR value: ${ldrValue}`);

    // If the light is low (LDR value is below the threshold), turn on the valve
    if (ldrValue < LDR_LIGHT_THRESHOLD) {
      valveRelay.writeSync(1);  // Turn on the valve if it's dark
      console.log("LDR detected low light, hydration valve turned on.");
    } else {
      valveRelay.writeSync(0);  // Turn off the valve if it's bright
      console.log("LDR detected high light, hydration valve turned off.");
    }
  } catch (error) {
    console.log("Error reading LDR: " + error.message);
  }
};

// Function to control hydration valve based on humidity
const controlHydrationValveWithHumidity = async () => {
  try {
    const { humidity } = await readHumidityAndTemp();
    console.log(`Current humidity: ${humidity}%`);

    // If the humidity is low, turn on the valve automatically
    if (humidity < humidityThreshold) {
      valveRelay.writeSync(1);  // Turn on the valve if humidity is low
      console.log("Humidity is low, hydration valve turned on.");
    } else {
      valveRelay.writeSync(0);  // Turn off the valve if humidity is sufficient
      console.log("Humidity is sufficient, hydration valve turned off.");
    }
  } catch (error) {
    console.log("Error reading humidity: " + error.message);
  }
};

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:3000`);
});
