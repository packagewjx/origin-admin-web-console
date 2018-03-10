import ObjectMeta from "./ObjectMeta";

export default class Template {
    /**
     * labels is a optional set of labels that are applied to every object during the Template to Config transformation.
     * @member {Object} labels
     */
    labels;

    /**
     * parameters is an optional array of Parameters used during the Template to Config transformation.
     * @member {Array.<Parameter>} parameters
     */
    parameters;

    /**
     * objects is an array of resources to include in this template. If a namespace value is hardcoded in the object, it will be removed during template instantiation, however if the namespace value is, or contains, a ${PARAMETER_REFERENCE}, the resolved value after parameter substitution will be respected and the object will be created in that namespace.
     * @member {Array.<any>} objects
     */
    objects;

    /**
     * message is an optional instructional message that will be displayed when this template is instantiated. This field should inform the user how to utilize the newly created resources. Parameter substitution will be performed on the message before being displayed so that generated credentials and other parameters can be included in the output.
     * @member {String} message
     */
    message;

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

    constructor() {
        this.apiVersion = "v1";
        this.kind = "Template";
        this.labels = {};
        this.message = "";
        this.metadata = new ObjectMeta();
        this.parameters = [];
        this.objects = [];
    }
}