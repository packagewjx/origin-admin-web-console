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

export function FieldDisplayer(props) {
    let fieldDisplay = (<span/>);
    let value = props.option.value;
    if (typeof value === 'undefined' && !props.option.displayIfUndefined) {
        return (<noscript/>);
    } else if (typeof props.option.displayRender === 'function') {
        //use the displayRender if it exists.
        return props.option.displayRender(props.option);
    } else if (props.option.isArray) {
        fieldDisplay = [];
        for (let i = 0; i < props.option.value.length; i++) {
            let option = new PropertyOption("", i + 1, props.option.type, props.option.value[i]);
            option.subOptions = props.option.subOptions;
            fieldDisplay.push(<FieldDisplayer key={i} option={option}/>);
            fieldDisplay.push(<hr key={"hr" + i}/>);
        }
    } else {
        //display it normally
        switch (props.option.type) {
            default:
                fieldDisplay = (
                    <span>{value}</span>
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
                let subOption = props.option.subOptions;
                let subOptionMap = {};
                if (subOption instanceof Array) {
                    //this method use the defined sub options.
                    for (let i = 0; i < subOption.length; i++) {
                        subOption[i].value = accessData(props.option.value, subOption[i].accessor);
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
                <strong>{props.option.label}:</strong>
            </Col>
            <Col lg={10}>
                {fieldDisplay}
            </Col>
        </Row>
    );
}

FieldDisplayer.propTypes = {
    option: PropTypes.instanceOf(PropertyOption)
};