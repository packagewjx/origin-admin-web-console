export default class RoleRef {
    /**
     * Name is the name of resource being referenced
     * @member {String} name
     */
    name;

    /**
     * Kind is the type of resource being referenced
     * @member {String} kind
     */
    kind;

    /**
     * APIGroup is the group for the resource being referenced
     * @member {String} apiGroup
     */
    apiGroup;

    constructor() {
        this.name = "";
        this.kind = "";
        this.apiGroup = "";
    }

}