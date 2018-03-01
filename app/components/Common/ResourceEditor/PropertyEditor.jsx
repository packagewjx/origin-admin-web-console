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

class PropertyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        let state = {};
        if (this.props.option.type === 'keyValue') {
            let keys = {};
            for (let key in this.props.option.value) {
                if (this.props.option.value.hasOwnProperty(key)) {
                    keys[key] = key;
                }
            }
            state.key = keys;
        }
        state.showModal = false;
        this.state = state;
    }

    handleChange(arg) {
        console.log(arg);
        this.props.onChange(arg);
    }

    render() {
        let option = this.props.option;
        if (typeof this.props.option.render === 'function') {
            return this.props.option.render(this.props.option.value, this.props.onChange);
        }
        else if (this.props.option.isArray) {
            return (<ArrayEditor option={this.props.option} onChange={this.handleChange}/>);
        } else if (this.props.option.type === 'keyValue') {
            return (
                <KeyValueEditor value={this.props.option.value} label={this.props.label}
                                onChange={this.handleChange}/>
            );
        } else {
            let formControl = {};
            if (this.props.option.type === 'select') {
                formControl = (
                    <SelectionFormControl label={this.props.option.label} value={this.props.option.value}
                                          selections={this.props.option.selections} onChange={this.handleChange}/>
                );
            }
            else if (this.props.option.type === 'boolean') {
                formControl = (
                    <BooleanFormControl label={this.props.option.label} value={this.props.option.value}
                                        onChange={this.handleChange}/>
                );
            }
            else if (this.props.option.type === 'object') {
                formControl = (
                    <ObjectFormControl label={option.label} value={option.value} subOptions={option.subOptions}/>
                );
            }
            else {
                formControl = (
                    <InputFormControl label={option.label} type={option.type} value={option.value}
                                      onChange={this.handleChange}
                                      placeholder={option.placeholder}/>
                );
            }

            return (
                <FormGroup>
                    {typeof this.props.option.label !== 'undefined' ?
                        <label className="col-lg-2 control-label">{this.props.option.label}</label> : null}
                    <Col lg={typeof this.props.option.label !== 'undefined' ? 10 : 12}>
                        {formControl}
                    </Col>
                </FormGroup>
            )
        }

    }
}

/**
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

function BooleanFormControl(props) {
    let onChange = function (event) {
        props.onChange(event.target.checked);
    };
    return (
        <div className="checkbox c-checkbox">
            <label className="needsclick">
                <input type="checkbox" checked={props.value}
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

class ObjectFormControl extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.submitChange = this.submitChange.bind(this);

        this.state = {showModal: false};
    }

    closeModal() {
        this.setState({showModal: false});
    }

    submitChange() {
        this.props.onChange(data);
        this.closeModal();
    }

    render() {
        let self = this;

        return (
            <div>
                <Button onClick={() => self.setState({showModal: true})}>查看&编辑</Button>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>编辑{this.props.label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ResourceEditor item={this.props.value}
                                        onConfirm={this.submitChange}
                                        onCancel={this.closeModal}
                                        propertyOptions={this.props.subOptions}/>
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
    onChange: PropTypes.func
};

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

class SelectionFormControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.state = {selections: []};
    }

    componentDidMount() {
        let selections = this.props.selections;
        let self = this;
        console.log(selections);
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
                <option key={option.value} value={option.value}>{option.label}</option>
            );
        }

        return (
            <FormControl value={this.props.value} onChange={this.handleChange}
                         componentClass="select" className="form-control m-b">
                {optionHtml}
            </FormControl>
        );
    }
}

SelectionFormControl.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    selections: PropTypes.oneOf(PropTypes.string, PropTypes.object),
    onChange: PropTypes.func
};

class ArrayEditor extends React.Component {
    constructor(props) {
        super(props);
        this.onItemChange = this.onItemChange.bind(this);

        console.log(this.props.option);
        this.state = {array: this.props.option.value};
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
        if (!array instanceof Array) {
            console.error("Given value is not an array!");
            return null;
        }

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
                                           label={option.label}/>
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
                <InputGroup>
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

PropertyEditor.propTypes = {
    option: PropTypes.instanceOf(PropertyOption).isRequired,
    onChange: PropTypes.func.isRequired,
};


export default PropertyEditor;