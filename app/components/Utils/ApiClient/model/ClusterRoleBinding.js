import ObjectMeta from "./ObjectMeta";
import ObjectReference from "./ObjectReference";

export default class ClusterRoleBinding {


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
     * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#resources
     * @member {String} apiVersion
     */
    apiVersion;

    /**
     * GroupNames holds all the groups directly bound to the role. This field should only be specified when supporting legacy clients and servers. See Subjects for further details.
     * @member {Array.<String>} groupNames
     */
    groupNames;

    /**
     * RoleRef can only reference the current namespace and the global namespace. If the ClusterRoleRef cannot be resolved, the Authorizer must return an error. Since Policy is a singleton, this is sufficient knowledge to locate a role.
     * @member {ObjectReference} roleRef
     */
    roleRef;

    /**
     * Subjects hold object references to authorize with this rule. This field is ignored if UserNames or GroupNames are specified to support legacy clients and servers. Thus newer clients that do not need to support backwards compatibility should send only fully qualified Subjects and should omit the UserNames and GroupNames fields. Clients that need to support backwards compatibility can use this field to build the UserNames and GroupNames.
     * @member {Array.<ObjectReference>} subjects
     */
    subjects;

    /**
     * UserNames holds all the usernames directly bound to the role. This field should only be specified when supporting legacy clients and servers. See Subjects for further details.
     * @member {Array.<String>} userNames
     */
    userNames;


    constructor() {
        this.apiVersion = "v1";
        this.kind = "ClusterRoleBinding";
        this.metadata = new ObjectMeta();
        this.roleRef = new ObjectReference();
        this.subjects = [];
        this.userNames = [];
        this.groupNames = [];
    }


}