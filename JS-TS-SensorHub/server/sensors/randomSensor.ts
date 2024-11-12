import IBasicNumericSensor from "../../interfaces/IBasicSensor";
export default class randomSensor implements IBasicNumericSensor {
    name: string;
    id: number;
    getData(): Promise<number> {
             return new Promise((resolve, reject) => {
              const min = 0;
              const max = 100;
          
              // Generate a random number between 0 and 100 (inclusive)
              const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
          
              resolve(randomNumber);
            });
          }
          
          
          
    }


