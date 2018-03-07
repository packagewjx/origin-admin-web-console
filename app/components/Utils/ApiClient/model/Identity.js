import ObjectMeta from "./ObjectMeta";

export default class Identity {
    /**
     * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
     * @member {String} apiVersion
     */
    apiVersion;

    /**
     * Extra holds extra information about this identity
     * @member {Object.<String, String>} extra
     */
    extra;

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

    /**
     * ProviderName is the source of identity information
     * @member {String} providerName
     */
    providerName;

    /**
     * ProviderUserName uniquely represents this identity in the scope of the provider
     * @member {String} providerUserName
     */
    providerUserName;

    /**
     * User is a reference to the user this identity is associated with Both Name and UID must be set
     * @member {ObjectReference} user
     */
    user;

    constructor() {
        this.kind = "Identity";
        this.apiVersion = "v1";
        this.metadata = new ObjectMeta();
    }

}