export default class PropertyOption {
    /**
     * This accessor is used to access a value of this object, Example:
     * 'a': return object.a
     * 'a.b': return object.a.b
     * 'a.b[1]': return object.a.b[1]]
     * @member {String} accessor
     */
    accessor;

    /**
     * This is the editor label for this property.
     * @member {String} label
     */
    label;

    /**
     * This is placeholder for input
     * @member {String} placeholder
     */
    placeholder;

    /**
     * Original Value
     * @member {any} value
     */
    value;


    /**
     * Indicate this property type. One of:
     * text, number, email, password: use default <input>
     * select: use <select>
     * boolean: use <input type=checkbox>
     * keyValue: use two <input>, one for key, one for value, to edit the object directly, but the value must not be an object.
     * object: this will use a modal to edit this object, using this ResourceEditor.
     * @member {String} type
     */
    type;

    /**
     * When type is select, use this to indicate the options for select
     * @member {Array.<{value:String, label:String}>}
     */
    selections;

    /**
     * If type is object, set this to configure the ResourceEditor of this object.
     * @member {Array.<PropertyOption>}
     */
    subOptions;

    /**
     * If this is set, then just use this rendering function to render a row, it will receive a value, onChange props, when value is changed,
     * use this to let ResourceEditor knows.
     * @member {function(value:any, onChange:function)}
     */
    render;

    constructor(accessor, label, type, value) {
        this.accessor = accessor;
        this.label = label;
        this.type = type;
        this.value = value || "";
    }
};

