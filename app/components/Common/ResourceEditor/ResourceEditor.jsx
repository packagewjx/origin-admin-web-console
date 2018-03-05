/**
 Date: 2/28/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {Button, Col, Row, Tab, Tabs} from "react-bootstrap";
import PropTypes from "prop-types";
import PropertyOption from "../PropertyOption";
import PropertyEditor from "./PropertyEditor";
import AceEditor from "react-ace";
import 'brace/mode/yaml';
import 'brace/theme/textmate';
import YAML from "yamljs"
import {accessData, deepClone} from "../../Utils/UtilFunctions";
import {FieldDisplayer} from "../FieldDisplayer";

class ResourceEditor extends React.Component {
    constructor(props) {
        super(props);
        this.confirmButtonClick = this.confirmButtonClick.bind(this);

        let item = deepClone(props.item);//clone the object to prevent accidentally change it original value.

        this.state = {item: item, changed: false, waiting: props.disabled || false};
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
        let propertyEditors = undefined;
        if (this.props.propertyOptions instanceof Array) {
            propertyEditors = [];
            for (let i = 0; i < this.props.propertyOptions.length; i++) {
                let option = this.props.propertyOptions[i];
                option.value = accessData(this.state.item, option.accessor);
                if (option.immutable) {
                    propertyEditors.push(
                        <FieldDisplayer option={option}/>
                    )
                } else {
                    propertyEditors.push(
                        <PropertyEditor
                            onChange={(data) => {
                                this.setState({
                                    item: accessData(this.state.item, option.accessor, data),
                                    changed: true
                                });
                            }}
                            key={i} option={option}/>
                    );
                }
                propertyEditors.push(<br key={"br" + i}/>);
            }
        }
        else {
            propertyEditors = (
                <h1>请编辑YAML</h1>
            );
        }


        return (
            <div>
                <Tabs id="EditorTabs">
                    <Tab eventKey={1} title="属性设置">
                        <form className="form-horizontal">
                            <fieldset disabled={this.state.waiting}>
                                {propertyEditors}
                                <br/>
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