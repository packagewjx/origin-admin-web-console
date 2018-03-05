/**
 Date: 3/5/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import PropertyOption from "./PropertyOption";
import {Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";

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
            fieldDisplay.push(<FieldDisplayer key={i} option={option}/>);
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
            case "object":
                fieldDisplay = [];
                for (let key in value) {
                    if (value.hasOwnProperty(key)) {
                        let option = new PropertyOption("", key, "object", value[key]);
                        fieldDisplay.push(<FieldDisplayer key={i} option={option}/>)
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