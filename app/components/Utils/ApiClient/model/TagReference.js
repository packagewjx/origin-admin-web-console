import ObjectReference from "./ObjectReference";
import TagImportPolicy from "./TagImportPolicy";
import TagReferencePolicy from "./TagReferencePolicy";

export default class TagReference {
    /**
     * Name of the tag
     * @member {String} name
     */
    name;

    /**
     * Optional; if specified, annotations that are applied to images retrieved via ImageStreamTags.
     * @member {Object} annotations
     */
    annotations;

    /**
     * Optional; if specified, a reference to another image that this tag should point to. Valid values are ImageStreamTag, ImageStreamImage, and DockerImage.
     * @member {ObjectReference} from
     */
    from;

    /**
     * Reference states if the tag will be imported. Default value is false, which means the tag will be imported.
     * @member {Boolean} reference
     */
    reference;

    /**
     * Generation is a counter that tracks mutations to the spec tag (user intent). When a tag reference is changed the generation is set to match the current stream generation (which is incremented every time spec is changed). Other processes in the system like the image importer observe that the generation of spec tag is newer than the generation recorded in the status and use that as a trigger to import the newest remote tag. To trigger a new import, clients may set this value to zero which will reset the generation to the latest stream generation. Legacy clients will send this value as nil which will be merged with the current tag generation.
     * @member {Number} generation
     */
    generation;

    /**
     * ImportPolicy is information that controls how images may be imported by the server.
     * @member {TagImportPolicy} importPolicy
     */
    importPolicy;

    /**
     * ReferencePolicy defines how other components should consume the image.
     * @member {TagReferencePolicy} referencePolicy
     */
    referencePolicy;

    constructor() {
        this.annotations = {};
        this.from = new ObjectReference();
        this.generation = 0;
        this.importPolicy = new TagImportPolicy();
        this.reference = false;
        this.referencePolicy = new TagReferencePolicy();
        this.name = "";
    }
}
