export default class TagImportPolicy {
    /**
     * Insecure is true if the server may bypass certificate verification or connect directly over HTTP during image import.
     * @member {Boolean} insecure
     */
    insecure;

    /**
     * Scheduled indicates to the server that this tag should be periodically checked to ensure it is up to date, and imported
     * @member {Boolean} scheduled
     */
    scheduled;

    constructor() {
        this.insecure = true;
        this.scheduled = true;
    }
}