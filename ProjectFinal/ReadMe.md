Our project includes:

1. Hardware Integration:
     Water pump control.
     LDR sensor setup.
     DHT21 temperature and humidity sensor integration.
     Ultrasonic sensor.
2. Backend Development:
     Node.js and Firebase integration.
3. Frontend Development:
     React-based web interface for monitoring and control.


1. As a User, I want to monitor the water pump system remotely.
Acceptance Criteria:
The system can be accessed via a web interface.
The user can view the water pump status (on/off).
The system shows the water level based on sensor readings.
2. As a User, I want the water pump to activate based on water levels detected by an ultrasonic sensor (HC-SR04).
Acceptance Criteria:
The water pump should turn on when the water level is low (below a set threshold).
The water pump should turn off when the water level is high (above the set threshold).
3. As a User, I want to check the temperature and humidity of the environment.
Acceptance Criteria:
The system retrieves data from the DHT21/AM2301 sensor.
The temperature and humidity readings are displayed on the web interface.
The user can view the current temperature and humidity levels in real-time.
4. As a User, I want to detect the day and night cycle using a Light Dependent Resistor (LDR).
Acceptance Criteria:
The system reads the LDR sensor and determines whether it's bright (day) or dark (night).
The system displays the current state (bright/dark) on the web interface.
5. As a User, I want to control a hydration valve remotely using a relay module.
Acceptance Criteria:
The hydration valve should be controllable through the web interface.
The system should provide a way to open or close the valve as needed.
6. As a User, I want to visualize the system’s status in real-time.
Acceptance Criteria:
The web interface shows real-time data of the water pump, temperature, humidity, water level, and light conditions.
The user can see the current state (on/off) of all components and sensors in the system.

