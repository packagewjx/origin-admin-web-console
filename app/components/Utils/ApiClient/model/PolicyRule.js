export default class PolicyRule {
    /**
     * Verbs is a list of Verbs that apply to ALL the ResourceKinds and AttributeRestrictions contained in this rule.  VerbAll represents all kinds.
     * @member {Array.<String>} verbs
     */
    _verbs;

    /**
     * AttributeRestrictions will vary depending on what the Authorizer/AuthorizationAttributeBuilder pair supports. If the Authorizer does not recognize how to handle the AttributeRestrictions, the Authorizer should report an error.
     * @member {String} attributeRestrictions
     */
    _attributeRestrictions;

    /**
     * APIGroups is the name of the APIGroup that contains the resources.  If this field is empty, then both kubernetes and origin API groups are assumed. That means that if an action is requested against one of the enumerated resources in either the kubernetes or the origin API group, the request will be allowed
     * @member {Array.<String>} apiGroups
     */
    _apiGroups;

    /**
     * Resources is a list of resources this rule applies to.  ResourceAll represents all resources.
     * @member {Array.<String>} resources
     */
    _resources;

    get verbs() {
        return this._verbs;
    }

    set verbs(value) {
        this._verbs = value;
    }

    get attributeRestrictions() {
        return this._attributeRestrictions;
    }

    set attributeRestrictions(value) {
        this._attributeRestrictions = value;
    }

    get apiGroups() {
        return this._apiGroups;
    }

    set apiGroups(value) {
        this._apiGroups = value;
    }

    get resources() {
        return this._resources;
    }

    set resources(value) {
        this._resources = value;
    }

    get resourceNames() {
        return this._resourceNames;
    }

    set resourceNames(value) {
        this._resourceNames = value;
    }

    get nonResourceURLs() {
        return this._nonResourceURLs;
    }

    set nonResourceURLs(value) {
        this._nonResourceURLs = value;
    }

    /**
     * ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
     * @member {Array.<String>} resourceNames
     */
    _resourceNames;

    /**
     * NonResourceURLsSlice is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path This name is intentionally different than the internal type so that the DefaultConvert works nicely and because the ordering may be different.
     * @member {Array.<String>} nonResourceURLs
     */
    _nonResourceURLs;
}