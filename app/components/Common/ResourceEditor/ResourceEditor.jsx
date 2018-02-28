/**
 Date: 2/28/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {Button, Col, Row, Tab, Tabs} from "react-bootstrap";
import PropTypes from "prop-types";
import PropertyOption from "./PropertyOption";
import PropertyEditor from "./PropertyEditor";

class ResourceEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {item: props.item};
    }

    render() {
        let propertyEditors = undefined;
        if (this.props.propertyOptions instanceof Array) {
            propertyEditors = [];
            for (let i = 0; i < this.props.propertyOptions.length; i++) {
                let option = this.props.propertyOptions[i];
                option.value = accessData(this.state.item, option.accessor);
                propertyEditors.push(<PropertyEditor
                    onChange={(data) => this.setState({item: accessData(this.state.item, option.accessor, data)})}
                    key={i} option={option}/>)
            }
        }
        else {
            propertyEditors = (
                <h1>无属性编辑</h1>
            );
        }


        return (
            <div>
                <Tabs id="EditorTabs">
                    <Tab eventKey={1} title="属性设置">
                        <form className="form-horizontal">
                            {propertyEditors}
                            <hr/>
                            <Row>
                                <Col lg={4}>
                                    <Button bsClass="btn btn-labeled btn-success mr">
                                        <span className="btn-label"><i className="fa fa-check"/></span> 确定
                                    </Button>
                                    <Button bsClass="btn btn-labeled btn-danger mr">
                                        <span className="btn-label"><i className="fa fa-times"/></span> 取消
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Tab>
                    <Tab eventKey={2} title="代码编辑">Mauris eros nibh, adipiscing ac commodo vel, molestie mattis
                        magna. </Tab>
                </Tabs>
            </div>
        );
    }
}

/**
 * Access the value of obj indicated by accessor.
 * @param {object} obj
 * @param {string} accessor
 * @param newVal new value for this data, if set.
 * @return {object} if newVal is set, return new object, otherwise the accessor data.
 */
function accessData(obj, accessor, newVal) {
    if (!accessor.match(/^([\w_$]+(\[\d+])?\.)*[\w_$]+(\[\d+])?$/g)) {
        console.error("accessor ", accessor, " is of wrong format");
        return null;
    }

    let keys = accessor.split(".");
    let cur = obj;
    let regExp = /^([\w_$])+(?:\[(\d+)])?$/g;
    for (let i = 0; i < keys.length - 1; i++) {
        let match = regExp.exec(keys[i]);
        if (typeof cur !== 'undefined' && cur.hasOwnProperty(match[1])) {
            if (match[2]) {
                cur = cur[match[1]][match[2]]
            } else {
                cur = cur[match[1]];
            }
        } else {
            return null;
        }
        regExp.lastIndex = 0;
    }
    if (typeof newVal !== 'undefined') {
        cur[keys[keys.length - 1]] = newVal;
        return obj;
    } else {
        return cur[keys[keys.length - 1]];
    }
}

ResourceEditor.propTypes = {
    propertyOptions: PropTypes.arrayOf(PropTypes.instanceOf(PropertyOption)),
    resourceName: PropTypes.string,
    item: PropTypes.object.isRequired,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
};

export default ResourceEditor;