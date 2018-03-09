export default class PersistentVolumeClaimStatus {
    /**
     * Phase represents the current phase of PersistentVolumeClaim.
     * @member {String} phase
     */
    phase;

    /**
     * AccessModes contains the actual access modes the volume backing the PVC has. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
     * @member {Array.<String>} accessModes
     */
    accessModes;

    /**
     * Represents the actual resources of the underlying volume.
     * @member {Object} capacity
     */
    capacity;

    constructor() {
        this.phase = "";
        this.accessModes = [];
        this.capacity = {};
    }
}