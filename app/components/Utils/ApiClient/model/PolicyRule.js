export default class PolicyRule {
    /**
     * Verbs is a list of Verbs that apply to ALL the ResourceKinds and AttributeRestrictions contained in this rule.  VerbAll represents all kinds.
     * @member {Array.<String>} verbs
     */
    verbs;

    /**
     * AttributeRestrictions will vary depending on what the Authorizer/AuthorizationAttributeBuilder pair supports. If the Authorizer does not recognize how to handle the AttributeRestrictions, the Authorizer should report an error.
     * @member {String} attributeRestrictions
     */
    attributeRestrictions;

    /**
     * APIGroups is the name of the APIGroup that contains the resources.  If this field is empty, then both kubernetes and origin API groups are assumed. That means that if an action is requested against one of the enumerated resources in either the kubernetes or the origin API group, the request will be allowed
     * @member {Array.<String>} apiGroups
     */
    apiGroups;

    /**
     * Resources is a list of resources this rule applies to.  ResourceAll represents all resources.
     * @member {Array.<String>} resources
     */
    resources;

    /**
     * ResourceNames is an optional white list of names that the rule applies to.  An empty set means that everything is allowed.
     * @member {Array.<String>} resourceNames
     */
    resourceNames;

    /**
     * NonResourceURLsSlice is a set of partial urls that a user should have access to.  *s are allowed, but only as the full, final step in the path This name is intentionally different than the internal type so that the DefaultConvert works nicely and because the ordering may be different.
     * @member {Array.<String>} nonResourceURLs
     */
    nonResourceURLs;
}