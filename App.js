import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define API endpoint
const API_URL = 'http://localhost:3000/api';

function App() {
  const [pumpStatus, setPumpStatus] = useState('off');
  const [valveStatus, setValveStatus] = useState('off');
  const [mode, setMode] = useState('manual');
  const [humidityThreshold, setHumidityThreshold] = useState(40);
  const [waterLevel, setWaterLevel] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [ldrValue, setLdrValue] = useState(0);

  // Fetch sensor data
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const waterLevelResponse = await axios.get(`${API_URL}/water-level`);
        const humidityResponse = await axios.get(`${API_URL}/humidity`);
        const ldrResponse = await axios.get(`${API_URL}/ldr`);
        setWaterLevel(waterLevelResponse.data.distance);
        setTemperature(humidityResponse.data.temperature);
        setHumidity(humidityResponse.data.humidity);
        setLdrValue(ldrResponse.data.ldrValue);
      } catch (error) {
        console.error('Error fetching sensor data', error);
      }
    };
    fetchSensorData();
  }, [pumpStatus, valveStatus]);

  // Handle pump control
  const handlePumpControl = async (action) => {
    try {
      const response = await axios.post(`${API_URL}/water-pump`, {
        action,
        mode
      });
      setPumpStatus(action);
      alert(response.data);
    } catch (error) {
      alert('Error controlling water pump: ' + error.message);
    }
  };

  // Handle valve control
  const handleValveControl = async (action) => {
    try {
      const response = await axios.post(`${API_URL}/hydration-valve`, {
        action,
        mode
      });
      setValveStatus(action);
      alert(response.data);
    } catch (error) {
      alert('Error controlling valve: ' + error.message);
    }
  };

  // Set the humidity threshold
  const handleSetHumidityThreshold = async () => {
    try {
      const response = await axios.post(`${API_URL}/set-humidity-threshold`, {
        threshold: humidityThreshold
      });
      alert(response.data);
    } catch (error) {
      alert('Error setting humidity threshold: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Smart Water Management System</h1>

        {/* Mode Block */}
        <div className="bg-indigo-100 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-medium text-gray-700">Mode: {mode}</h2>
          <select
            className="mt-4 p-2 border-2 border-indigo-400 rounded-md"
            onChange={(e) => setMode(e.target.value)}
            value={mode}
          >
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>

        {/* Sensor Data Block */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-medium text-gray-700">Sensor Data</h2>
          <p className="mt-2 text-lg text-gray-600">Water Level: {waterLevel} cm</p>
          <p className="mt-2 text-lg text-gray-600">Temperature: {temperature}°C</p>
          <p className="mt-2 text-lg text-gray-600">Humidity: {humidity}%</p>
          <p className="mt-2 text-lg text-gray-600">LDR Value: {ldrValue ? 'Low Light' : 'High Light'}</p>
        </div>

        {/* Pump Control Block */}
        <div className={`bg-${pumpStatus === 'on' ? 'green' : 'red'}-100 p-6 rounded-lg mb-6`}>
          <h2 className="text-2xl font-medium text-gray-700">Water Pump</h2>
          <div className={`text-xl font-semibold ${pumpStatus === 'on' ? 'text-green-600' : 'text-red-600'}`}>
            Status: {pumpStatus}
          </div>
          <div className="mt-4">
            <button
              onClick={() => handlePumpControl('on')}
              disabled={pumpStatus === 'on'}
              className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              Turn On Pump
            </button>
            <button
              onClick={() => handlePumpControl('off')}
              disabled={pumpStatus === 'off'}
              className="ml-4 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              Turn Off Pump
            </button>
          </div>
        </div>

        {/* Valve Control Block */}
        <div className={`bg-${valveStatus === 'on' ? 'green' : 'red'}-100 p-6 rounded-lg mb-6`}>
          <h2 className="text-2xl font-medium text-gray-700">Hydration Valve</h2>
          <div className={`text-xl font-semibold ${valveStatus === 'on' ? 'text-green-600' : 'text-red-600'}`}>
            Status: {valveStatus}
          </div>
          <div className="mt-4">
            <button
              onClick={() => handleValveControl('on')}
              disabled={valveStatus === 'on'}
              className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              Turn On Valve
            </button>
            <button
              onClick={() => handleValveControl('off')}
              disabled={valveStatus === 'off'}
              className="ml-4 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              Turn Off Valve
            </button>
          </div>
        </div>

        {/* Humidity Threshold Block */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-medium text-gray-700">Set Humidity Threshold</h2>
          <input
            type="number"
            value={humidityThreshold}
            onChange={(e) => setHumidityThreshold(e.target.value)}
            className="mt-4 p-3 border-2 border-gray-300 rounded-md w-full"
          />
          <button
            onClick={handleSetHumidityThreshold}
            className="mt-4 bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600"
          >
            Set Threshold
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;






