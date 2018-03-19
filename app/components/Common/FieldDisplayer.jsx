/**
 Date: 3/5/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import PropertyOption from "./PropertyOption";
import {Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import {accessData, goToLeafObject, splitString} from "../Utils/UtilFunctions";

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
            let selectionMap = {};
            for (let i = 0; i < selections.length; i++) {
                selectionMap[selections[i].value] = selections[i].label;
            }
            self.setState({selectionMap: selectionMap});
        };

        if (this.props.option.type === "select") {
            //when this is an array, it will create the selection map to pass down to each FieldDisplayer child.
            //when not, it will calculate its own map.
            let selections = this.props.option.selections;
            if (!!selections && typeof selections.then === 'function') {
                selections.then(selectFunc);
            } else {
                selectFunc(selections);
            }
        }
    }

    render() {
        let fieldDisplay = (<span/>);
        let value = this.props.value;
        if ((typeof value === 'undefined' || value === null) && !this.props.option.displayIfUndefined) {
            return (<noscript/>);
        } else if (typeof this.props.option.displayRender === 'function') {
            //use the displayRender if it exists.
            return this.props.option.displayRender(this.props.option, value);
        } else if (this.props.option.isArray) {
            fieldDisplay = [];
            for (let i = 0; i < this.props.value.length; i++) {
                let option = new PropertyOption("", i + 1, this.props.option.type);
                option.subOptions = this.props.option.subOptions;
                option.selections = this.props.option.selections;
                fieldDisplay.push(<FieldDisplayer key={i} option={option} value={this.props.value[i]}/>);
                fieldDisplay.push(<hr style={{marginTop: 5, marginBottom: 5, borderTop: "1px solid #999999"}}
                                      key={"hr" + i}/>);
            }
            fieldDisplay.splice(fieldDisplay.length - 1, 1);//remove the last hr
        } else {
            //display it normally
            switch (this.props.option.type) {
                default:
                    fieldDisplay = (
                        <span>{value}</span>
                    );
                    break;
                case "boolean":
                    fieldDisplay = (
                        <span>{value ? "是" : "否"}</span>
                    );
                    break;
                case "select":
                    fieldDisplay = (
                        <span>{this.state.selectionMap[value] || value}</span>
                    );
                    break;
                case "keyValue":
                    fieldDisplay = [];
                    for (let key in value) {
                        if (value.hasOwnProperty(key)) {
                            let option = new PropertyOption("", key, "text");
                            fieldDisplay.push(<FieldDisplayer key={key} option={option} value={value[key]}/>)
                        }
                    }
                    break;
                case "selectSet":
                    fieldDisplay = [];
                    //calculate the map mapping accessor => label
                    for (let i = 0; i < this.props.option.selections.length; i++) {
                        let selection = this.props.option.selections[i];
                        let accessor = selection.propertyOption.accessor;
                        let data = accessData(this.props.value, accessor);
                        if (typeof data !== "undefined") {
                            fieldDisplay.push(<FieldDisplayer key={i} value={data} option={selection.propertyOption}/>);
                        }
                    }
                    break;
                case "object":
                    let subOptions = this.props.option.subOptions;
                    if (subOptions instanceof Array && subOptions.length > 0) {
                        fieldDisplay = [];
                        for (let i = 0; i < subOptions.length; i++) {
                            let data = accessData(this.props.value, subOptions[i].accessor);
                            if (typeof data !== 'undefined') {
                                fieldDisplay.push(<FieldDisplayer option={subOptions[i]} value={data}/>)
                            }
                        }
                    }
                    else {
                        //this automatically generate fields
                        fieldDisplay = [];
                        for (let key in value) {
                            if (value.hasOwnProperty(key)) {
                                let valueKeyValue = value[key];
                                let option = undefined;
                                if (typeof valueKeyValue === 'object' && valueKeyValue !== null)
                                    option = new PropertyOption("", key, "object");
                                else
                                    option = new PropertyOption("", key, "text");
                                fieldDisplay.push(<FieldDisplayer key={key} option={option} value={valueKeyValue}/>)
                            }
                        }
                    }
            }
        }

        return (
            <Row>
                <Col lg={2}>
                    <p className="text-right"><strong>{this.props.option.label}:</strong></p>
                    {/*<label className="control-label text-right">{this.props.option.label}:</label>*/}
                </Col>
                <Col lg={10}>
                    {fieldDisplay}
                </Col>
            </Row>
        );
    }

}

/**
 * when an accessor is multilevel, meaning it has "." inside. This function will go into the level in the value,
 * then return the one level propertyOption and the value. create the parent object along the way.
 * @param {String} accessor
 * @param {any} value
 * @return {{accessor: String, value: any}} revised option and value. propertyOption.accessor has no "." (except the raw ".").
 */
function toOneLevel(accessor, value) {
    let keys = splitString(accessor, ".", "\\.");
    //if this has no ".", just return.
    if (keys.length <= 1)
        return {accessor, value};

    let leaf = goToLeafObject(keys, value);
    accessor = keys[keys.length - 1];
    return {accessor, value: leaf};
}

FieldDisplayer.propTypes = {
    option: PropTypes.instanceOf(PropertyOption),
    /**
     * For display a select field, it will use this value-label map, to display the label rather than just display value.
     */
    selectionMap: PropTypes.object,
    /**
     * The value that this displayer is displayed
     */
    value: PropTypes.any
};