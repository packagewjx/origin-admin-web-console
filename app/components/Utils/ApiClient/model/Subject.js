export default class Subject {
    /**
     * Namespace of the referenced object.  If the object kind is non-namespace, such as \"User\" or \"Group\", and this value is not empty the Authorizer should report an error.
     * @member {String} namespace
     */
    namespace;

    /**
     * Name of the object being referenced.
     * @member {String} name
     */
    name;

    /**
     * Kind of object being referenced. Values defined by this API group are \"User\", \"Group\", and \"ServiceAccount\". If the Authorizer does not recognized the kind value, the Authorizer should report an error.
     * @member {String} kind
     */
    kind;

    /**
     * APIGroup holds the API group of the referenced subject. Defaults to \"\" for ServiceAccount subjects. Defaults to \"rbac.authorization.k8s.io\" for User and Group subjects.
     * @member {String} apiGroup
     */
    apiGroup;

    constructor() {
        this.name = "";
        this.namespace = "";
        this.kind = "";
        this.apiGroup = "";
    }
}