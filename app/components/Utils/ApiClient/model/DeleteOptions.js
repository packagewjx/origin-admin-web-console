export default class DeleteOptions {
    /**
     * @member {string} kind
     */
    _kind;

    /**
     * @member {string} apiVersion
     */
    _apiVersion;

    /**
     * @member {number} gracePeriodSeconds
     */
    _gracePeriodSeconds;

    /**
     * @member {Preconditions} preconditions
     */
    _preconditions;

    /**
     * @member {boolean} orphanDependents
     */
    _orphanDependents;

    /**
     * @member {DeletionPropagation} propagationPolicy
     */
    _propagationPolicy;

    constructor() {
        this._kind = "DeleteOptions";
        this._apiVersion = "v1";
        this._gracePeriodSeconds = 60;
    }


    get preconditions() {
        return this._preconditions;
    }

    set preconditions(value) {
        this._preconditions = value;
    }

    get orphanDependents() {
        return this._orphanDependents;
    }

    set orphanDependents(value) {
        this._orphanDependents = value;
    }

    get propagationPolicy() {
        return this._propagationPolicy;
    }

    set propagationPolicy(value) {
        this._propagationPolicy = value;
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

    get gracePeriodSeconds() {
        return this._gracePeriodSeconds;
    }

    set gracePeriodSeconds(value) {
        this._gracePeriodSeconds = value;
    }
}