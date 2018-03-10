export default class ImageLookupPolicy {
    /**
     * local will change the docker short image references (like \"mysql\" or \"php:latest\") on objects in this namespace to the image ID whenever they match this image stream, instead of reaching out to a remote registry. The name will be fully qualified to an image ID if found. The tag's referencePolicy is taken into account on the replaced value. Only works within the current namespace.
     * @member {Boolean} local
     */
    local;
}