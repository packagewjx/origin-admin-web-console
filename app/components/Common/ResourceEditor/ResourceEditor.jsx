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
import brace from "brace";
import AceEditor from "react-ace";
import 'brace/mode/yaml';
import 'brace/theme/textmate';
import YAML from "yamljs"

class ResourceEditor extends React.Component {
    constructor(props) {
        super(props);
        this.confirmButtonClick = this.confirmButtonClick.bind(this);

        this.state = {item: props.item, changed: false, waiting: props.disabled || false};
    }

    confirmButtonClick(event) {
        let result = this.props.onConfirm(this.state.item);
        if (result === true) {
            // if boolean
            this.setState({changed: false});
        } else if (!!result && typeof result.then === 'function') {
            // if result is a promise, so when it is fulfilled, set to changed false
            let self = this;
            this.setState({waiting: true});
            result.then(function () {
                self.setState({changed: false, waiting: false});
            }, function () {
                self.setState({waiting: false});
            })
        }
    }

    render() {
        let self = this;
        let propertyEditors = undefined;
        if (this.props.propertyOptions instanceof Array) {
            propertyEditors = [];
            for (let i = 0; i < this.props.propertyOptions.length; i++) {
                let option = this.props.propertyOptions[i];
                option.value = accessData(this.state.item, option.accessor);
                propertyEditors.push(
                    <PropertyEditor
                        onChange={(data) => this.setState({
                            item: accessData(this.state.item, option.accessor, data),
                            changed: true
                        })}
                        key={i} option={option}/>
                )
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
                            <fieldset disabled={this.state.waiting}>
                                {propertyEditors}
                                <hr/>
                                <Row>
                                    <Col lg={6}>
                                        <Button disabled={!this.state.changed || this.state.waiting}
                                                onClick={this.confirmButtonClick}
                                                bsClass="btn btn-labeled btn-success mr">
                                            <span className="btn-label"><i className="fa fa-check"/></span> 确定
                                        </Button>
                                        <Button onClick={this.props.onCancel} bsClass="btn btn-labeled btn-danger mr">
                                            <span className="btn-label"><i className="fa fa-times"/></span> 取消
                                        </Button>
                                        {this.state.waiting ?
                                            <strong>请稍侯...</strong>
                                            : null}
                                    </Col>
                                </Row>
                            </fieldset>
                        </form>
                    </Tab>
                    <Tab eventKey={2} title="编辑YAML">
                        <AceEditor
                            mode="yaml"
                            theme="textmate"
                            value={YAML.stringify(this.state.item, null, 2)}
                            onBlur={(event, editor) => {
                                this.setState({item: YAML.parse(editor.getValue())});
                            }}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{$blockScrolling: true}}
                        />
                        <hr/>
                        <Row>
                            <Col lg={6}>
                                <Button disabled={this.state.waiting}
                                        onClick={this.confirmButtonClick}
                                        bsClass="btn btn-labeled btn-success mr">
                                    <span className="btn-label"><i className="fa fa-check"/></span> 确定
                                </Button>
                                <Button onClick={this.props.onCancel} disabled={this.state.waiting} bsClass="btn btn-labeled btn-danger mr">
                                    <span className="btn-label"><i className="fa fa-times"/></span> 取消
                                </Button>
                                {this.state.waiting ?
                                    <strong>请稍侯...</strong>
                                    : null}
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

/**
 * Access the value of obj indicated by accessor. If this accessor cannot access a data, it WILL NOT create the data parent,
 * just return, except when the last accessor is undefined, it will create the data. So be sure the set some default.
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
    /**
     * return true to indicate item changed successfully, false otherwise. Return a Promise, when promise fulfilled, it
     * indicate item changed successfully.
     * @type {function(data:object)}
     */
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
};

export default ResourceEditor;