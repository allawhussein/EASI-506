import React, { useState, useEffect } from 'react';
import { GaugeComponent } from 'react-gauge-component';
import IBasicNumericSensor from '../interfaces/IBasicSensor';
import ComputerRamUsageSensor from '../server/sensors/ComputerRamConsumptionSensor';
import ComputerBatterySensor from '../server/sensors/ComputerBatterySensor';
import ComputerTemperatureSensor from "../server/sensors/ComputerTemperatureSensor"
import ComputerCpuConsumptionSensor from "../server/sensors/ComputerCpuConsumptionSensor"

function BasicGage({ sensor }:{ sensor: IBasicNumericSensor }) {
    const [value, setValue] = useState<number | null>(null);
    useEffect(() => {
        let isMounted = true;
        sensor.getData().then((newValue) => {
            if (isMounted) {
                setValue(newValue);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [sensor]);

    return (
        <GaugeComponent
            id={sensor.name}
            value={value || 0}
            minValue={0}
            maxValue={100}
        />
    );
}

export default function GageArray() {
    const batterySensor: IBasicNumericSensor = new ComputerBatterySensor(0, "battery");
    const cpuSensor: IBasicNumericSensor = new ComputerCpuConsumptionSensor(1, "CPU");
    const temperatureSensor: IBasicNumericSensor = new ComputerTemperatureSensor(2, "temperature");
    const ramSensor: IBasicNumericSensor = new ComputerRamUsageSensor(3, "RAM");
    
    return <>
        <BasicGage sensor = {batterySensor} />
        <BasicGage sensor = {cpuSensor} />
        <BasicGage sensor = {temperatureSensor} />
        <BasicGage sensor = {ramSensor} />
    </>
}