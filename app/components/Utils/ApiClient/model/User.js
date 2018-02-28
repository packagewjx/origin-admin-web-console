export default class User {
    constructor() {
        this._kind = "User";
        this._apiVersion = "v1";
    }

    /**
     * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
     * @member {String} apiVersion
     */
    _apiVersion;

    get apiVersion() {
        return this._apiVersion;
    }

    set apiVersion(value) {
        this._apiVersion = value;
    }

    /**
     * FullName is the full name of user
     * @member {String} fullName
     */
    _fullName;

    get fullName() {
        return this._fullName;
    }

    set fullName(value) {
        this._fullName = value;
    }

    /**
     * Groups specifies group names this user is a member of. This field is deprecated and will be removed in a future release. Instead, create a Group object containing the name of this User.
     * @member {Array.<String>} groups
     */
    _groups;

    get groups() {
        return this._groups;
    }

    set groups(value) {
        this._groups = value;
    }

    /**
     * Identities are the identities associated with this user
     * @member {Array.<String>} identities
     */
    _identities;

    get identities() {
        return this._identities;
    }

    set identities(value) {
        this._identities = value;
    }

    /**
     * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
     * @member {String} kind
     */
    _kind;

    get kind() {
        return this._kind;
    }

    set kind(value) {
        this._kind = value;
    }

    /**
     * Standard object's metadata.
     * @member {ObjectMeta} metadata
     */
    _metadata;

    get metadata() {
        return this._metadata;
    }

    set metadata(value) {
        this._metadata = value;
    }
}