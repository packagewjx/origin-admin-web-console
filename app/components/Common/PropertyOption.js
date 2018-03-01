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
     * If this Property is an array, it will render add and delete button. And based on type, render it, except keyValue.
     * @member {boolean}
     */
    isArray;

    /**
     * When create new object in array, Will call this function;
     * @member {function}
     */
    newValue;


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
     * When type is select, use this to indicate the options for select. If selections is a promise, PropertyEditor
     * will register the onFulfilled callback to get the selections.
     * @member {Array.<{value:String, label:String}> | Promise}
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

    /**
     * This is used for display this property
     * @member {function(value:any, propertyOption: PropertyOption)}
     */
    displayRender;

    constructor(accessor, label, type, value, newValue) {
        this.accessor = accessor;
        this.label = label;
        this.type = type || "text";
        this.value = value || "";
        this.newValue = newValue || function () {
            switch (this.type) {
                case "object":
                    return {};
                case "number":
                    return 0;
                case "boolean":
                    return false;
                default:
                    return "";
            }
        }
    }
};

