export default class ClusterRole {
    get metadata() {
        return this._metadata;
    }

    set metadata(value) {
        this._metadata = value;
    }

    get rules() {
        return this._rules;
    }

    set rules(value) {
        this._rules = value;
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
     * Rules holds all the PolicyRules for this ClusterRole
     * @member {Array.<PolicyRule>} rules
     */
    _rules;

    constructor() {
        this._kind = "ClusterRole";
        this._apiVersion = "v1";
    }
}