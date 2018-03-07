/**
 Date: 3/5/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import PropertyOption from "./PropertyOption";
import {Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import {accessData} from "../Utils/UtilFunctions";

/**
 * A component used to display a field. If this field is a value, just display its label and value. If it is an object
 * or a keyValue object, it will recursively display its descendants. If it is an array, it will display the index and
 * the value.
 * @param props
 * @return {*}
 * @constructor
 */
export class FieldDisplayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectionMap: {}};
    }

    componentDidMount() {
        let self = this;
        let selectFunc = function (selections) {
            console.log(selections);
            let selectionMap = {};
            for (let i = 0; i < selections.length; i++) {
                selectionMap[selections[i].value] = selections[i].label;
            }
            self.setState({selectionMap: selectionMap});
        };

        if (this.props.option.type === "select") {
            let selections = this.props.option.selections;
            console.log(this.props.option);
            if (!!selections && typeof selections.then === 'function') {
                selections.then(selectFunc);
            } else {
                selectFunc(selections);
            }
        }
    }

    render() {
        let fieldDisplay = (<span/>);
        let value = this.props.option.value;
        if (typeof value === 'undefined' && !this.props.option.displayIfUndefined) {
            return (<noscript/>);
        } else if (typeof this.props.option.displayRender === 'function') {
            //use the displayRender if it exists.
            return this.props.option.displayRender(this.props.option);
        } else if (this.props.option.isArray) {
            fieldDisplay = [];
            for (let i = 0; i < this.props.option.value.length; i++) {
                let option = new PropertyOption("", i + 1, this.props.option.type, this.props.option.value[i]);
                option.subOptions = this.props.option.subOptions;
                option.selections = this.props.option.selections;
                fieldDisplay.push(<FieldDisplayer key={i} option={option} selectionMap={this.state.selectionMap}/>);
                fieldDisplay.push(<hr key={"hr" + i}/>);
            }
        } else {
            //display it normally
            switch (this.props.option.type) {
                default:
                    fieldDisplay = (
                        <span>{value}</span>
                    );
                    break;
                case "select":
                    fieldDisplay = (
                        <span>{this.props.selectionMap[value]}</span>
                    );
                    break;
                case "keyValue":
                    fieldDisplay = [];
                    for (let key in value) {
                        if (value.hasOwnProperty(key)) {
                            let option = new PropertyOption("", key, "text", value[key]);
                            fieldDisplay.push(<FieldDisplayer key={key} option={option}/>)
                        }
                    }
                    break;
                case "object":
                    let subOption = this.props.option.subOptions;
                    let subOptionMap = {};
                    if (subOption instanceof Array) {
                        //this method use the defined sub options.
                        for (let i = 0; i < subOption.length; i++) {
                            subOption[i].value = accessData(this.props.option.value, subOption[i].accessor);
                            subOptionMap[subOption[i].accessor] = subOption[i];
                        }
                        fieldDisplay = [];
                        for (let key in value) {
                            if (value.hasOwnProperty(key)) {
                                fieldDisplay.push(<FieldDisplayer key={key} option={subOptionMap[key]}/>);
                            }
                        }
                    } else {
                        //this automatically generate fields
                        fieldDisplay = [];
                        for (let key in value) {
                            if (value.hasOwnProperty(key)) {
                                let valueKeyValue = value[key];
                                let option = undefined;
                                if (typeof valueKeyValue === 'object' && valueKeyValue !== null)
                                    option = new PropertyOption("", key, "object", valueKeyValue);
                                else
                                    option = new PropertyOption("", key, "text", valueKeyValue);
                                fieldDisplay.push(<FieldDisplayer key={key} option={option}/>)
                            }
                        }
                    }
            }
        }

        return (
            <Row>
                <Col lg={2}>
                    <strong>{this.props.option.label}:</strong>
                </Col>
                <Col lg={10}>
                    {fieldDisplay}
                </Col>
            </Row>
        );
    }

}

FieldDisplayer.propTypes = {
    option: PropTypes.instanceOf(PropertyOption),
    /**
     * For display a select field, it will use this value-label map, to display the label rather than just display value.
     */
    selectionMap: PropTypes.object,
};