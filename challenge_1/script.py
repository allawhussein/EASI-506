import datetime

def getTemperature() -> int:
    temp = int(input())

    if (temp < -20 or temp > 80): # human can't typicall surviv such condition
        raise ValueError("Temperature value is out of bound")

    return temp

def getHumidity() -> int:
    humidity = int(input())

    if (humidity < 0 or humidity > 100): # humidity is a relative percentage
        raise ValueError("Humidity value is out of bound")
    
    return humidity

def log(message : str) -> None:
    with open("./logs.txt", 'a') as logFile:
        logFile.write(str(datetime.datetime.now()) + ", " + message + "\n")

def main():
    fanTurnedOn = False
    while True:
        try:
            temperature = getTemperature()
            humidity = getHumidity()
            
            if (temperature > 30 and humidity < 50):
                if (not fanTurnedOn):
                    print("Turning Fan On")
                fanTurnedOn = True
            else:
                if(fanTurnedOn):
                    print("Turning Fan Off")
                fanTurnedOn = False
        except ValueError as error:
            print("ValueError occured: ", error)
            log("ValueError Occured")
            log(str(error))
        except KeyboardInterrupt:
            print("Closing program")
            exit()
        except:
            print("An Unhandled Exception Occured")
            log("Unhandled Error Occured, type: " + type(error))
            log(str(error))



if __name__ == "__main__":
    main()