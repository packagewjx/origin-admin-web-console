export default class RoleBinding {
    /**
     * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
     * @member {String} kind
     */
    _kind;

    /**
     * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
     * @member {String} apiVersion
     */
    _apiVersion;

    /**
     * Standard object's metadata.
     * @member {ObjectMeta} metadata
     */
    _metadata;

    /**
     * UserNames holds all the usernames directly bound to the role. This field should only be specified when supporting legacy clients and servers. See Subjects for further details.
     * @member {Array.<String>} userNames
     */
    _userNames;

    /**
     * GroupNames holds all the groups directly bound to the role. This field should only be specified when supporting legacy clients and servers. See Subjects for further details.
     * @member {Array.<String>} groupNames
     */
    _groupNames;

    /**
     * Subjects hold object references to authorize with this rule. This field is ignored if UserNames or GroupNames are specified to support legacy clients and servers. Thus newer clients that do not need to support backwards compatibility should send only fully qualified Subjects and should omit the UserNames and GroupNames fields. Clients that need to support backwards compatibility can use this field to build the UserNames and GroupNames.
     * @member {Array.<ObjectReference>} subjects
     */
    _subjects;

    get metadata() {
        return this._metadata;
    }

    set metadata(value) {
        this._metadata = value;
    }

    get userNames() {
        return this._userNames;
    }

    set userNames(value) {
        this._userNames = value;
    }

    get groupNames() {
        return this._groupNames;
    }

    set groupNames(value) {
        this._groupNames = value;
    }

    get subjects() {
        return this._subjects;
    }

    set subjects(value) {
        this._subjects = value;
    }

    get roleRef() {
        return this._roleRef;
    }

    set roleRef(value) {
        this._roleRef = value;
    }

    get kind() {
        return this._kind;
    }

    set kind(value) {
        this._kind = value;
    }

    get apiVersion() {
        return this._apiVersion;
    }

    set apiVersion(value) {
        this._apiVersion = value;
    }

    /**
     * RoleRef can only reference the current namespace and the global namespace. If the RoleRef cannot be resolved, the Authorizer must return an error. Since Policy is a singleton, this is sufficient knowledge to locate a role.
     * @member {ObjectReference} roleRef
     */
    _roleRef;

    constructor() {
        this._kind = "RoleBinding";
        this._apiVersion = "v1";
    }
}