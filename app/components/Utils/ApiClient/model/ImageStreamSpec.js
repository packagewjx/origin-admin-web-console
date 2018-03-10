import ImageLookupPolicy from "./ImageLookupPolicy";

export default class ImageStreamSpec {
    /**
     * lookupPolicy controls how other resources reference images within this namespace.
     * @member {ImageLookupPolicy} lookupPolicy
     */
    lookupPolicy;

    /**
     * dockerImageRepository is optional, if specified this stream is backed by a Docker repository on this server Deprecated: This field is deprecated as of v3.7 and will be removed in a future release. Specify the source for the tags to be imported in each tag via the spec.tags.from reference instead.
     * @member {String} dockerImageRepository
     */
    dockerImageRepository;

    /**
     * tags map arbitrary string values to specific image locators
     * @member {Array.<TagReference>} tags
     */
    tags;

    constructor() {
        this.dockerImageRepository = "";
        this.lookupPolicy = new ImageLookupPolicy();
        this.tags = [];
    }
}