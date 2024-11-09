import IBasicNumericSensor from "../../interfaces/IBasicSensor";
import * as net from 'net';

class ComputerBatterySensor implements IBasicNumericSensor {

    // IBasicSensor Implementation
    readonly name: string;
    readonly id: number;
    
    constructor (id: number, name: string) {
        // maybe have some validation
        this.name = name;
        this.id = id;
    }
    async getData(): Promise<number> { // Code from ChatGPT, but it's by idea
        try {
            const serverAddress = '127.0.0.1';
            const serverPort = 8080;
            const message = 'batteryPercentage';
            // Create a socket
            const clientSocket = new net.Socket();
            // Connect to the server
            await new Promise<void>((resolve, reject) => { clientSocket.connect(
                serverPort, 
                serverAddress, 
                () => {resolve();}
            ).on('error', reject);
            });
            // Send the message
            clientSocket.write(message);
            // Receive the response
            let responseData = '';
            clientSocket.on('data', (chunk) => {
              responseData += chunk.toString();
            });
            // Wait for the response
            await new Promise((resolve) => {
              clientSocket.once('end', resolve);
            });
            console.log('Response:', responseData);
            // Close the connection
            clientSocket.end()
            return parseInt(responseData);
          } catch (error) {
            console.error('Error occurred:', error);
            return -1;
          }
    }
}