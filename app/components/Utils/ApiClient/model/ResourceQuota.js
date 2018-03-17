export default class ResourceQuota {
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
     * @member {module:model/V1ObjectMeta} metadata
     */
    metadata;

    /**
     * Spec defines the desired quota. https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status
     * @member {ResourceQuotaSpec} spec
     */
    spec;

    /**
     * Status defines the actual enforced quota and its current usage. https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status
     * @member {ResourceQuotaStatus} status
     */
    status;
}