/**
 Date: 2/28/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import PropTypes from "prop-types";
import PropertyOption from "../PropertyOption";
import {Button, Col, FormControl, FormGroup, InputGroup, Modal, Row} from "react-bootstrap";
import ResourceEditor from "./ResourceEditor";

/**
 * This is the class that generate the field editor based on a single PropertyOption. It use some sub components to
 * make this work.
 * @see ArrayEditor
 * @see KeyValueEditor
 * @see BooleanFormControl
 * @see InputFormControl
 * @see SelectionFormControl
 * @see ObjectFormControl
 */
class PropertyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        let state = {};
        if (this.props.option.type === 'keyValue') {
            let keys = {};
            for (let key in this.props.value) {
                if (this.props.value.hasOwnProperty(key)) {
                    keys[key] = key;
                }
            }
            state.key = keys;
        }
        state.showObjectEditModal = false;
        this.state = state;
    }

    handleChange(arg) {
        this.props.onChange(arg);
    }

    render() {
        let option = this.props.option;
        if (typeof option.render === 'function') {
            return option.render(this.props.value, this.props.onChange);
        }
        else if (option.isArray) {
            return (<ArrayEditor option={option} value={this.props.value} onChange={this.handleChange}
                                 isCreate={this.props.isCreate}/>);
        } else if (option.type === 'keyValue') {
            return (
                <KeyValueEditor value={this.props.value} label={option.label}
                                onChange={this.handleChange}/>
            );
        } else {
            let formControl = {};
            if (option.type === 'select') {
                formControl = (
                    <SelectionFormControl label={option.label} value={this.props.value}
                                          selections={option.selections} onChange={this.handleChange}/>
                );
            }
            else if (option.type === 'boolean') {
                formControl = (
                    <BooleanFormControl label={option.label} value={this.props.value}
                                        onChange={this.handleChange}/>
                );
            }
            else if (option.type === 'object') {
                formControl = (
                    <ObjectFormControl label={option.label} value={this.props.value} subOptions={option.subOptions}
                                       onChange={this.handleChange} newValue={option.newValue}
                                       isCreate={this.props.isCreate}/>
                );
            }
            else {
                formControl = (
                    <InputFormControl label={option.label} type={option.type} value={this.props.value}
                                      onChange={this.handleChange}
                                      placeholder={option.placeholder}/>
                );
            }

            return (
                <FormGroup>
                    {typeof option.label !== 'undefined' ?
                        <label className="col-lg-2 control-label">{option.label}</label> : null}
                    <Col lg={typeof option.label !== 'undefined' ? 10 : 12}>
                        {formControl}
                    </Col>
                </FormGroup>
            )
        }

    }
}

/**
 * The default form element, use <input> to edit this field, and can set its type, using PropertyOption.type.
 * @param {{label, placeholder, value, type, onChange:Function}} props
 * @return {*}
 * @constructor
 */
function InputFormControl(props) {
    let onChange = function (event) {
        props.onChange(event.target.value);
    };
    return (
        <FormControl type={props.type} placeholder={props.placeholder}
                     value={props.value}
                     onChange={onChange}
                     className="form-control"/>
    );
}

InputFormControl.propTypes = {
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

/**
 * This is just a checkbox component, editing the boolean value.
 * @param props
 * @return {*}
 * @constructor
 */
function BooleanFormControl(props) {
    let onChange = function (event) {
        props.onChange(event.target.checked);
    };
    return (
        <div className="checkbox c-checkbox">
            <label className="needsclick">
                <input type="checkbox" checked={props.value}
                       value={props.value}
                       onChange={onChange}
                       className="needsclick"/>
                <em className="fa fa-check"/></label>
        </div>
    );
}

BooleanFormControl.propTypes = {
    label: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func
};

/**
 * This component is used to edit a more complex object. Using a modal, display another ResourceEditor to edit this object.
 * The sub-ResourceEditor will use the subOptions of the PropertyEditor.
 */
class ObjectFormControl extends React.Component {

    constructor(props) {
        super(props);
        this.closeObjectEditModal = this.closeObjectEditModal.bind(this);
        this.submitChange = this.submitChange.bind(this);

        this.state = {showObjectEditModal: false};
    }

    closeObjectEditModal() {
        this.setState({showObjectEditModal: false});
    }

    submitChange(data) {
        this.props.onChange(data);
        this.closeObjectEditModal();
    }

    render() {
        let self = this;
        let value = this.props.value || (typeof this.props.newValue === 'function' ? this.props.newValue() : {});

        return (
            <div>
                <Button onClick={() => self.setState({showObjectEditModal: true})}>查看&编辑</Button>
                <Modal show={this.state.showObjectEditModal} onHide={this.closeObjectEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>编辑{this.props.label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ResourceEditor item={value}
                                        onConfirm={this.submitChange}
                                        onCancel={this.closeObjectEditModal}
                                        propertyOptions={this.props.subOptions}
                                        isCreate={this.props.isCreate}/>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

ObjectFormControl.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    subOptions: PropTypes.arrayOf(PropTypes.instanceOf(PropertyOption)),
    onChange: PropTypes.func,
    newValue: PropTypes.func,
    isCreate: PropTypes.bool
};

/**
 * This component is used to edit key value map. You can edit both the key and the value. It will generate all key value
 * <input> component. But I did prefer using the object editor to edit key value, so
 * TODO add a keyValue PropertyOptions Generate function, to edit the keyValue pairs using the object editor.
 */
class KeyValueEditor extends React.Component {
    constructor(props) {
        super(props);

        this.submitKeyChange = this.submitKeyChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleKeyChange = this.handleKeyChange.bind(this);

        let keys = {};
        for (let key in this.props.value) {
            if (this.props.value.hasOwnProperty(key)) {
                keys[key] = key;
            }
        }
        /**
         * the key property is a map, key is the original key, value is the key that is changed by the user.
         * When the user changed the key, it will change this map's key, but not the item's key. Item's key will only
         * be changed when the <input> element changing this key has lost focus. This is to prevent a bug that when you
         * edit object's key, the state is updated, and the old <input> is deleted because the key is deleted, and then
         * render the new <input> storing the new key.
         * @type {{key: {}}}
         */
        this.state = {key: keys};
    }

    handleKeyChange(event, oldKey) {
        let keys = this.state.key;
        keys[oldKey] = event.target.value;
        this.setState({key: keys});
    }

    /**
     * This function is called when the input of key is lost focus. This time key will submit to the actual object.
     * @param event
     * @param oldKey
     */
    submitKeyChange(event, oldKey) {
        if (event.target.value === oldKey) {
            //if the key unchanged, just return
            return;
        }
        //change the key to newKey
        let map = this.props.value;
        let value = map[oldKey];
        delete map[oldKey];
        map[event.target.value] = value;
        this.props.onChange(map);
        // also change the state key
        let keys = this.state.key;
        delete keys[oldKey];
        keys[event.target.value] = event.target.value;
        this.setState({key: keys});
    }

    handleValueChange(event, key) {
        let map = this.props.value;
        map[key] = event.target.value;
        this.props.onChange(map);
    }

    render() {
        let rowsHtml = [];
        let map = this.props.value;
        for (let key in map) {
            if (map.hasOwnProperty(key)) {
                rowsHtml.push(
                    <Row key={key}>
                        <Col lg={6}>
                            <FormControl onBlur={(event) => this.submitKeyChange(event, key)} type="text"
                                         value={this.state.key[key]}
                                         onChange={(event) => this.handleKeyChange(event, key)}
                                         className="form-control"/>
                        </Col>
                        <Col lg={6}>
                            <FormControl type="text" value={map[key]}
                                         onChange={(event) => this.handleValueChange(event, key)}
                                         className="form-control"/>
                        </Col>
                    </Row>
                );
            }
        }

        return (
            <FormGroup>
                <label className="col-lg-2 control-label">{this.props.label}</label>
                <Col lg={10}>
                    {rowsHtml}
                </Col>
            </FormGroup>
        );
    }
}

KeyValueEditor.propTypes = {
    value: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
};

/**
 * This component will generate a select drop menu, using the selections props supply, and fetch selections if necessary.
 */
class SelectionFormControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.state = {selections: []};
    }

    componentDidMount() {
        let selections = this.props.selections;
        let self = this;
        if (selections instanceof Array) {
            self.setState({selections});
        } else if (!!selections && typeof selections.then === 'function') {
            selections.then(function (options) {
                self.setState({selections: options});
            })
        }
    }

    handleChange(event) {
        this.props.onChange(event.target.value);
    }

    render() {
        let optionHtml = [];
        for (let i = 0; i < this.state.selections.length; i++) {
            let option = this.state.selections[i];
            optionHtml.push(
                <option key={i} value={option.value}>{option.label}</option>
            );
        }

        return (
            <FormControl value={this.props.value} onChange={this.handleChange}
                         componentClass="select" className="form-control m-b">
                <option value=""/>
                {optionHtml}
            </FormControl>
        );
    }
}

SelectionFormControl.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    selections: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onChange: PropTypes.func
};

/**
 * If this property is an array, this component will generate the array display, each element will will its own editor,
 * using current PropertyOption.
 */
class ArrayEditor extends React.Component {
    constructor(props) {
        super(props);
        this.onItemChange = this.onItemChange.bind(this);

        this.state = {array: this.props.value};
    }

    onItemChange(data, index) {
        let array = this.state.array;
        array.splice(index, 1, data);
        this.props.onChange(array);
    }

    render() {
        let itemEditors = [];
        let option = this.props.option;
        let array = this.state.array;
        if (!(array instanceof Array))
            return null;

        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            let itemEditor = undefined;
            switch (option.type) {
                case 'keyValue':
                    console.error("Array Editor did not support keyValue!");
                    return null;
                case 'select':
                    itemEditor = (
                        <SelectionFormControl value={item} label={option.label} selections={option.selections}
                                              onChange={(data) => this.onItemChange(data, i)}/>
                    );
                    break;
                case 'object':
                    itemEditor = (
                        <ObjectFormControl onChange={(data) => this.onItemChange(data, i)} value={item}
                                           label={option.label} subOptions={option.subOptions}
                                           isCreate={this.props.isCreate}/>
                    );
                    break;
                case 'boolean':
                    itemEditor = (
                        <BooleanFormControl onChange={(data) => this.onItemChange(data, i)} label={option.label}
                                            value={item}/>
                    );
                    break;
                default:
                    itemEditor = (
                        <InputFormControl onChange={(data) => this.onItemChange(data, i)}
                                          value={item} type={option.type} placeholder={option.placeholder}/>
                    );
                    break;
            }
            itemEditors.push(
                <InputGroup key={i}>
                    {itemEditor}
                    <InputGroup.Button>
                        <Button bsClass="btn btn-labeled btn-danger mr" onClick={() => {
                            let array = this.state.array;
                            array.splice(i, 1);
                            this.props.onChange(array);
                        }}><em className="fa fa-minus"/></Button>
                    </InputGroup.Button>
                </InputGroup>
            );
            itemEditors.push(<br key={"br" + i}/>);
        }


        return (
            <FormGroup>
                <label className="col-lg-2 control-label">{this.props.option.label}</label>
                <Col lg={10}>
                    {itemEditors}
                    <Button bsClass="btn btn-labeled btn-success mr" onClick={() => {
                        let array = this.state.array;
                        //give the new value based on its type
                        array.push(option.newValue());
                        this.props.onChange(array);
                    }}><em className="fa fa-plus"/></Button>
                </Col>
            </FormGroup>
        );
    }
}

ArrayEditor.propTypes = {
    value: PropTypes.array,
    option: PropTypes.instanceOf(PropertyOption),
    onChange: PropTypes.func,
    isCreate: PropTypes.bool
};


PropertyEditor.propTypes = {
    /**
     * The PropertyOption for this field. To configure how to edit it.
     */
    option: PropTypes.instanceOf(PropertyOption).isRequired,
    /**
     * After this field change, it will call this onChange method, to give the new value to the upper class.
     * @type {function(data:any)}
     */
    onChange: PropTypes.func.isRequired,
    /**
     * The current value of this propertyEditor editing.
     */
    value: PropTypes.any,
    /**
     * To pass down to the ObjectFormControl's ResourceEditor
     */
    isCreate: PropTypes.bool
};


export default PropertyEditor;