import IBasicNumericSensor from "../../interfaces/IBasicSensor";

class ComputerTemperatureSensor implements IBasicNumericSensor {

    // IBasicSensor Implementation
    readonly name: string;
    readonly id: number;

    getData(): Promise<number> {
        throw new Error("Method not implemented. Requires a services to avoid administrator privileges");
        // (Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace "root/wmi")
        // actual implementation requires interface with WMI with administrator privilege
        // which is unrecommended for a web application
    }
    
    constructor (id: number, name: string) {
        // maybe have some validation
        this.name = name;
        this.id = id;
    }
}