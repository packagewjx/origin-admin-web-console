import ObjectMeta from "./ObjectMeta";
import PersistentVolumeClaimSpec from "./PersistentVolumeClaimSpec";
import PersistentVolumeClaimStatus from "./PersistentVolumeClaimStatus";

export default class PersistentVolumeClaim {
    /**
     * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
     * @member {String} kind
     */
    kind;

    /**
     * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
     * @member {String} apiVersion
     */
    apiVersion;

    /**
     * Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata
     * @member {ObjectMeta} metadata
     */
    metadata;

    /**
     * Spec defines the desired characteristics of a volume requested by a pod author. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
     * @member {PersistentVolumeClaimSpec} spec
     */
    spec;

    /**
     * Status represents the current information/status of a persistent volume claim. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims
     * @member {PersistentVolumeClaimStatus} status
     */
    status;

    constructor() {
        this.kind = "PersistentVolumeClaim";
        this.apiVersion = "v1";
        this.metadata = new ObjectMeta();
        this.spec = new PersistentVolumeClaimSpec();
        this.status = new PersistentVolumeClaimStatus();
    }
}