export default class PersistentVolumeStatus {
    /**
     * Phase indicates if a volume is available, bound to a claim, or released by a claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#phase
     * @member {String} phase
     */
    phase;

    /**
     * A human-readable message indicating details about why the volume is in this state.
     * @member {String} message
     */
    message;

    /**
     * Reason is a brief CamelCase string that describes any failure and is meant for machine parsing and tidy display in the CLI.
     * @member {String} reason
     */
    reason;
}