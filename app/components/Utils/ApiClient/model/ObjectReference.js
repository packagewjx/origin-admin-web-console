export default class ObjectReference {
    constructor() {
        this._kind = "ObjectReference";
        this._apiVersion = "v1";
    }

    /**
     * Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#types-kinds
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
     * Namespace of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
     * @member {String} namespace
     */
    _namespace;

    get namespace() {
        return this._namespace;
    }

    set namespace(value) {
        this._namespace = value;
    }

    /**
     * Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
     * @member {String} name
     */
    _name;

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    /**
     * UID of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#uids
     * @member {String} uid
     */
    _uid;

    get uid() {
        return this._uid;
    }

    set uid(value) {
        this._uid = value;
    }

    /**
     * API version of the referent.
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
     * Specific resourceVersion to which this reference is made, if any. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#concurrency-control-and-consistency
     * @member {String} resourceVersion
     */
    _resourceVersion;

    get resourceVersion() {
        return this._resourceVersion;
    }

    set resourceVersion(value) {
        this._resourceVersion = value;
    }

    /**
     * If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manifest.containers[2]. For example, if the object reference is to a container within a pod, this would take on a value like: \"spec.containers{name}\" (where \"name\" refers to the name of the container that triggered the event) or if no container name is specified \"spec.containers[2]\" (container with index 2 in this pod). This syntax is chosen only to have some well-defined way of referencing a part of an object.
     * @member {String} fieldPath
     */
    _fieldPath;

    get fieldPath() {
        return this._fieldPath;
    }

    set fieldPath(value) {
        this._fieldPath = value;
    }
}