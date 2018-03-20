import ObjectMeta from "./ObjectMeta";

export default class Group {
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
     * Users is the list of users in this group.
     * @member {Array.<String>} users
     */
    users;

    constructor() {
        this.kind = "Group";
        this.apiVersion = "v1";
        this.metadata = new ObjectMeta();
        this.users = [];
    }
}