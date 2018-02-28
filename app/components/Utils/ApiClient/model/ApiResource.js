export default class ApiResource {
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get singularName() {
        return this._singularName;
    }

    set singularName(value) {
        this._singularName = value;
    }

    get namespaced() {
        return this._namespaced;
    }

    set namespaced(value) {
        this._namespaced = value;
    }

    get kind() {
        return this._kind;
    }

    set kind(value) {
        this._kind = value;
    }

    get verbs() {
        return this._verbs;
    }

    set verbs(value) {
        this._verbs = value;
    }

    get shortNames() {
        return this._shortNames;
    }

    set shortNames(value) {
        this._shortNames = value;
    }

    get categories() {
        return this._categories;
    }

    set categories(value) {
        this._categories = value;
    }
    /**
     * name is the plural name of the resource.
     * @member {String} name
     */
    _name;

    /**
     * singularName is the singular name of the resource.  This allows clients to handle plural and singular opaquely. The singularName is more correct for reporting status on a single item and both singular and plural are allowed from the kubectl CLI interface.
     * @member {String} singularName
     */
    _singularName;

    /**
     * namespaced indicates if a resource is namespaced or not.
     * @member {Boolean} namespaced
     */
    _namespaced;

    /**
     * kind is the kind for the resource (e.g. 'Foo' is the kind for a resource 'foo')
     * @member {String} kind
     */
    _kind;

    /**
     * verbs is a list of supported kube verbs (this includes get, list, watch, create, update, patch, delete, deletecollection, and proxy)
     * @member {Array.<String>} verbs
     */
    _verbs;

    /**
     * shortNames is a list of suggested short names of the resource.
     * @member {Array.<String>} shortNames
     */
    _shortNames;

    /**
     * categories is a list of the grouped resources this resource belongs to (e.g. 'all')
     * @member {Array.<String>} categories
     */
    _categories;
}