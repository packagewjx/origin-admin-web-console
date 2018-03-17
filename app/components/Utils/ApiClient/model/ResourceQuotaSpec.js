export default class ResourceQuotaSpec {
    /**
     * Hard is the set of desired hard limits for each named resource. More info: https://git.k8s.io/community/contributors/design-proposals/admission_control_resource_quota.md
     * @member {Object} hard
     */
    hard;

    /**
     * A collection of filters that must match each object tracked by a quota. If not specified, the quota matches all objects.
     * values are 'Terminating', 'NotTerminating', 'BestEffort', 'NotBestEffort'
     * @member {Array.<String>} scopes
     */
    scopes;

    constructor() {
        this.hard = {};
        this.scopes = [];
    }

}