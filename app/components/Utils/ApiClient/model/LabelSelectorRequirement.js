export default class LabelSelectorRequirement {
    /**
     * key is the label key that the selector applies to.
     * @member {String} key
     */
    key;

    /**
     * operator represents a key's relationship to a set of values. Valid operators ard In, NotIn, Exists and DoesNotExist.
     * @member {String} operator
     */
    operator;

    /**
     * values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.
     * @member {Array.<String>} values
     */
    values;

    constructor() {
        this.key = "";
        this.operator = "";
        this.values = [];
    }
}