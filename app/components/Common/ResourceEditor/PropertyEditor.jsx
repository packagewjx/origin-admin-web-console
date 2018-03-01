/**
 Date: 2/28/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import PropTypes from "prop-types";
import PropertyOption from "./PropertyOption";
import {Col, FormControl, FormGroup, Row} from "react-bootstrap";

class PropertyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyChange = this.handleKeyChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.submitKeyChange = this.submitKeyChange.bind(this);

        if (this.props.option.type === 'keyValue') {
            let keys = {};
            for (let key in this.props.option.value) {
                if (this.props.option.value.hasOwnProperty(key)) {
                    keys[key] = key;
                }
            }
            this.state = {key: keys};
        }
    }

    handleChange(event) {
        let type = this.props.option.type;
        if (type === 'boolean') {
            this.props.onChange(event.target.checked);
        } else if (type === 'keyValue') {

        } else {
            this.props.onChange(event.target.value);
        }
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
        let map = this.props.option.value;
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
        let map = this.props.option.value;
        map[key] = event.target.value;
        this.props.onChange(map);
    }

    render() {
        if (this.props.option.type === 'select') {
            let optionHtml = [];
            for (let i = 0; i < this.props.option.selections.length; i++) {
                let option = this.props.option.selections[i];
                optionHtml.push(
                    <option key={option.value} value={option.value}>{option.label}</option>
                );
            }

            return (
                <FormGroup>
                    <label className="col-lg-2 control-label">{this.props.option.label}</label>
                    <Col lg={10}>
                        <FormControl value={this.props.option.value} onChange={this.handleChange}
                                     componentClass="select" className="form-control m-b">
                            {optionHtml}
                        </FormControl>
                    </Col>
                </FormGroup>
            );
        }
        else if (this.props.option.type === 'boolean') {
            return (
                <FormGroup>
                    <label className="col-lg-2 control-label">{this.props.option.label}</label>
                    <Col lg={10}>
                        <div className="checkbox c-checkbox">
                            <label className="needsclick">
                                <input type="checkbox" checked={this.props.option.value}
                                       onChange={this.handleChange}
                                       className="needsclick"/>
                                <em className="fa fa-check"/></label>
                        </div>
                    </Col>
                </FormGroup>
            );
        }
        else if (this.props.option.type === 'keyValue') {
            let rowsHtml = [];
            let map = this.props.option.value;

            for (let key in map) {
                if (map.hasOwnProperty(key)) {
                    rowsHtml.push(
                        <Row key={key}>
                            <Col lg={6}>
                                <FormControl onBlur={(event) => this.submitKeyChange(event, key)} type="text" value={this.state.key[key]}
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
                    <label className="col-lg-2 control-label">{this.props.option.label}</label>
                    <Col lg={10}>
                        {rowsHtml}
                    </Col>
                </FormGroup>
            );
        } else {
            return (
                <FormGroup>
                    <label className="col-lg-2 control-label">{this.props.option.label}</label>
                    <Col lg={10}>
                        <FormControl type={this.props.option.type} placeholder={this.props.option.placeholder}
                                     value={this.props.option.value}
                                     onChange={this.handleChange}
                                     className="form-control"/>
                    </Col>
                </FormGroup>
            );
        }
    }
}


PropertyEditor.propTypes = {
    option: PropTypes.instanceOf(PropertyOption).isRequired,
    onChange: PropTypes.func.isRequired,
};


export default PropertyEditor;