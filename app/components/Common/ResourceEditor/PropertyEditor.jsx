/**
 Date: 2/28/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import PropTypes from "prop-types";
import PropertyOption from "../PropertyOption";
import {Button, Col, FormControl, FormGroup, Modal, Row} from "react-bootstrap";
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
        let type = this.props.option.type;
        if (type === 'boolean') {
            this.props.onChange(arg.target.checked);
        } else if (type === 'keyValue') {
            this.props.onChange(arg)
        } else {
            this.props.onChange(arg.target.value);
        }
    }

    render() {
        let option = this.props.option;
        if (typeof this.props.option.render === 'function') {
            return this.props.option.render(this.props.option.value, this.props.onChange);
        }
        else if (this.props.option.type === 'select') {
            return (
                <SelectionEditor label={this.props.option.label} value={this.props.option.value}
                                 selections={this.props.option.selections} onChange={this.handleChange}/>
            );
        }
        else if (this.props.option.type === 'boolean') {
            return (
                <BooleanEditor label={this.props.option.label} value={this.props.option.value}
                               onChange={this.handleChange}/>
            );
        }
        else if (this.props.option.type === 'keyValue') {
            return (
                <KeyValueEditor value={this.props.option.value} label={this.props.label} onChange={this.handleChange}/>
            );
        }
        else if (this.props.option.type === 'object') {
            return (
                <ObjectEditor label={option.label} value={option.value} subOptions={option.subOptions}/>
            );
        }
        else {
            return (
                <InputEditor label={option.label} type={option.type} value={option.value} onChange={this.handleChange}
                             placeholder={option.placeholder}/>
            );
        }
    }
}

/**
 * @param {{label, placeholder, value, type, onChange:Function}} props
 * @return {*}
 * @constructor
 */
function InputEditor(props) {
    return (
        <FormGroup>
            <label className="col-lg-2 control-label">{props.label}</label>
            <Col lg={10}>
                <FormControl type={props.type} placeholder={props.placeholder}
                             value={props.value}
                             onChange={props.onChange}
                             className="form-control"/>
            </Col>
        </FormGroup>
    );
}

function BooleanEditor(props) {
    return (
        <FormGroup>
            <label className="col-lg-2 control-label">{props.label}</label>
            <Col lg={10}>
                <div className="checkbox c-checkbox">
                    <label className="needsclick">
                        <input type="checkbox" checked={props.value}
                               onChange={props.onChange}
                               className="needsclick"/>
                        <em className="fa fa-check"/></label>
                </div>
            </Col>
        </FormGroup>
    );
}

class ObjectEditor extends React.Component {

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
            <FormGroup>
                <label className="col-lg-2 control-label">{this.props.label}</label>
                <Col lg={10}>
                    <Button onClick={() => self.setState({showModal: true})}>查看&编辑</Button>
                </Col>
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
            </FormGroup>
        );
    }
}

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

class SelectionEditor extends React.Component {
    constructor(props) {
        super(props);

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
                console.log(options);
                self.setState({selections: options});
            })
        }
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
            <FormGroup>
                <label className="col-lg-2 control-label">{this.props.label}</label>
                <Col lg={10}>
                    <FormControl value={this.props.value} onChange={this.props.onChange}
                                 componentClass="select" className="form-control m-b">
                        {optionHtml}
                    </FormControl>
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