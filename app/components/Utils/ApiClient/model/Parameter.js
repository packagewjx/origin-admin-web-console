export default class Parameter {
    /**
     * Name must be set and it can be referenced in Template Items using ${PARAMETER_NAME}. Required.
     * @member {String} name
     */
    name;

    /**
     * Optional: The name that will show in UI instead of parameter 'Name'
     * @member {String} displayName
     */
    displayName;

    /**
     * Description of a parameter. Optional.
     * @member {String} description
     */
    description;

    /**
     * Value holds the Parameter data. If specified, the generator will be ignored. The value replaces all occurrences of the Parameter ${Name} expression during the Template to Config transformation. Optional.
     * @member {String} value
     */
    value;

    /**
     * generate specifies the generator to be used to generate random string from an input value specified by From field. The result string is stored into Value field. If empty, no generator is being used, leaving the result Value untouched. Optional.  The only supported generator is \"expression\", which accepts a \"from\" value in the form of a simple regular expression containing the range expression \"[a-zA-Z0-9]\", and the length expression \"a{length}\".  Examples:  from             | value
     * @member {String} generate
     */
    generate;

    /**
     * From is an input value for the generator. Optional.
     * @member {String} from
     */
    from;

    /**
     * Optional: Indicates the parameter must have a value.  Defaults to false.
     * @member {Boolean} required
     */
    required;

    constructor() {
        this.description = "";
        this.displayName = "";
        this.name = "";
        this.required = false;
        this.value = "";
    }

}