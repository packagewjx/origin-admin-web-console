export default class DeleteOptions {
    /**
     * @member {string} kind
     */
    kind;

    /**
     * @member {string} apiVersion
     */
    apiVersion;

    /**
     * @member {number} gracePeriodSeconds
     */
    gracePeriodSeconds;

    /**
     * @member {Preconditions} preconditions
     */
    preconditions;

    /**
     * @member {boolean} orphanDependents
     */
    orphanDependents;

    /**
     * @member {DeletionPropagation}
     */
    propagationPolicy;

    constructor() {
        this.kind = "DeleteOptions";
        this.apiVersion = "v1";
        this.gracePeriodSeconds = 60;
    }


}