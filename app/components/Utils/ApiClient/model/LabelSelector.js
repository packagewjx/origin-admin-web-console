export default class LabelSelector {
    /**
     * matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is \"key\", the operator is \"In\", and the values array contains only \"value\". The requirements are ANDed.
     * @member {Object} matchLabels
     */
    matchLabels;

    /**
     * matchExpressions is a list of label selector requirements. The requirements are ANDed.
     * @member {Array.<LabelSelectorRequirement>} matchExpressions
     */
    matchExpressions;

    constructor() {
        this.matchExpressions = [];
        this.matchLabels = {};
    }
}