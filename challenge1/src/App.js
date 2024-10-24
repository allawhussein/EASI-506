import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [sensorReadings, setSensorReadings] = useState([])

  const fetchSensorDataAsync = async () => {
    await axios.get('http://localhost:9900/getSensors')
      .then(function (response) {
        // handle success
        const data = response.data.data
        setSensorReadings(data)
      })
      .catch(function (error) {
        // handle error
        console.log('ERROR', error);
      })
  }

  return (
    <div className="bg-red-500 w-full h-screen">
      <div className='flex flex-col md:flex-row items-center justify-center w-full bg-green-400'>
        <div className='bg-slate-300 w-full md:w1/2 h-24'>Bouchra</div>
        <div className='bg-slate-600 w-full md:w1/2 h-24'>Alexy</div>
      </div>
      <button
        className='w-[300px] h-20 bg-green-400 rounded-xl'
        onClick={() => fetchSensorDataAsync()}
      >
        Get Sensor Readings
      </button>

      <button
        className='w-[300px] h-20 bg-green-900 rounded-xl mx-4'
        onClick={() => setSensorReadings([])}
      >
        Reset
      </button>


      <div className='w-full bg-orange-400 p-4'>
        {sensorReadings?.length > 0 ?
          sensorReadings?.map(item => {
            return (
              <div className='bg-orange-900 text-white text-center'>{item} </div>
            )
          }) : null}
      </div>
    </div>
  );
}

export default App;
