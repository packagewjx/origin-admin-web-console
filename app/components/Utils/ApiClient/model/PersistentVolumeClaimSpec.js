import LabelSelector from "./LabelSelector";
import ResourceRequirements from "./ResourceRequirements";

export default class PersistentVolumeClaimSpec {
    /**
     * AccessModes contains the desired access modes the volume should have. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
     * @member {Array.<String>} accessModes
     */
    accessModes;

    /**
     * A label query over volumes to consider for binding.
     * @member {LabelSelector} selector
     */
    selector;

    /**
     * Resources represents the minimum resources the volume should have. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources
     * @member {ResourceRequirements} resources
     */
    resources;

    /**
     * VolumeName is the binding reference to the PersistentVolume backing this claim.
     * @member {String} volumeName
     */
    volumeName;

    /**
     * Name of the StorageClass required by the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1
     * @member {String} storageClassName
     */
    storageClassName;

    constructor() {
        this.accessModes = [];
        this.selector = new LabelSelector();
        this.resources = new ResourceRequirements();
        this.volumeName = "";
        this.storageClassName = "";
    }

}