import PersistentVolumeSpec from "./PersistentVolumeSpec";

export default class PersistentVolume {
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
     * Spec defines a specification of a persistent volume owned by the cluster. Provisioned by an administrator. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes
     * @member {PersistentVolumeSpec} spec
     */
    spec;

    /**
     * Status represents the current information/status for the persistent volume. Populated by the system. Read-only. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistent-volumes
     * @member {PersistentVolumeStatus} status
     */
    status;

    constructor() {
        this.kind = "PersistentVolume";
        this.apiVersion = "v1";
        this.spec = new PersistentVolumeSpec();
    }
}