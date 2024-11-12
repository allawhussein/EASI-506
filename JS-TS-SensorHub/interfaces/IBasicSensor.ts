export default interface IBasicNumericSensor {
    name: string,
    id: number,
    getData(): Promise<number>
}