export default class ApiResource {
    /**
     * name is the plural name of the resource.
     * @member {String} name
     */
    name;

    /**
     * singularName is the singular name of the resource.  This allows clients to handle plural and singular opaquely. The singularName is more correct for reporting status on a single item and both singular and plural are allowed from the kubectl CLI interface.
     * @member {String} singularName
     */
    singularName;

    /**
     * namespaced indicates if a resource is namespaced or not.
     * @member {Boolean} namespaced
     */
    namespaced;

    /**
     * kind is the kind for the resource (e.g. 'Foo' is the kind for a resource 'foo')
     * @member {String} kind
     */
    kind;

    /**
     * verbs is a list of supported kube verbs (this includes get, list, watch, create, update, patch, delete, deletecollection, and proxy)
     * @member {Array.<String>} verbs
     */
    verbs;

    /**
     * shortNames is a list of suggested short names of the resource.
     * @member {Array.<String>} shortNames
     */
    shortNames;

    /**
     * categories is a list of the grouped resources this resource belongs to (e.g. 'all')
     * @member {Array.<String>} categories
     */
    categories;
}