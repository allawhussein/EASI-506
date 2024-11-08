// This interface should be implemented in all sensors to enable "feature exploration"
// Inspired from "Component Object Model" of Microsoft
// I will allow the dynamic expansion of the code base without altering stable behaviour
// And will allow granular modification of a subset of features for a given sensor if the need arises

export default interface IExplorable {
    isInterfaceSupported(queriedInterfaceId: string): boolean,
    getSupportedInterfaces(): string[],
}