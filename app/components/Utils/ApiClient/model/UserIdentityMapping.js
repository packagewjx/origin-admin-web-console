import ObjectMeta from "./ObjectMeta";
import ObjectReference from "./ObjectReference";

export default class UserIdentityMapping {
    /**
     * User is a reference to a user
     * @member {ObjectReference} user
     */
    user;

    /**
     * Standard object's metadata.
     * @member {ObjectMeta} metadata
     */
    metadata;

    /**
     * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
     * @member {String} kind
     */
    kind;

    /**
     * Identity is a reference to an identity
     * @member {ObjectReference} identity
     */
    identity;

    /**
     * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
     * @member {String} apiVersion
     */
    apiVersion;

    constructor() {
        this.metadata = new ObjectMeta();
        this.user = new ObjectReference();
        this.identity = new ObjectReference();
        this.kind = "UserIdentityMapping";
        this.apiVersion = "v1";
    }

}