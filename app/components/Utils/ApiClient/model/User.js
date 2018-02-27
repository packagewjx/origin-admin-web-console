export default class User {
    /**
     * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
     * @member {String} apiVersion
     */
    apiVersion;
    /**
     * FullName is the full name of user
     * @member {String} fullName
     */
    fullName;
    /**
     * Groups specifies group names this user is a member of. This field is deprecated and will be removed in a future release. Instead, create a Group object containing the name of this User.
     * @member {Array.<String>} groups
     */
    groups;
    /**
     * Identities are the identities associated with this user
     * @member {Array.<String>} identities
     */
    identities;
    /**
     * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
     * @member {String} kind
     */
    kind;
    /**
     * Standard object's metadata.
     * @member {ObjectMeta} metadata
     */
    metadata;

    constructor() {
        this.kind = "User";
        this.apiVersion = "v1";
    }
}