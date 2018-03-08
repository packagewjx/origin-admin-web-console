export default class ClusterRole {
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
     * Standard object's metadata.
     * @member {ObjectMeta} metadata
     */
    metadata;

    /**
     * Rules holds all the PolicyRules for this ClusterRole
     * @member {Array.<PolicyRule>} rules
     */
    rules;

    constructor() {
        this.kind = "ClusterRole";
        this.apiVersion = "v1";
        this.rules = [];
    }
}