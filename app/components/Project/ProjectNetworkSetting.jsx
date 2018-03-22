/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ContentWrapper from "../Layout/ContentWrapper";
import {Button, Col, Row} from "react-bootstrap";
import PropertyEditor from "../Common/ResourceEditor/PropertyEditor";
import {apiClient} from "../Utils/ApiClient/apiClient";
import {Link} from "react-router";
import {getNamespacePropertyOption} from "../Common/PredefinedPropertyOption";

class ProjectNetworkSetting extends React.Component {
    constructor(props) {
        super(props);
        this.clearData = this.clearData.bind(this);
        this.submitData = this.submitData.bind(this);

        this.state = {global: [], joinTo: "", join: [], isolate: [], waiting: false};
    }

    clearData() {
        this.setState({global: [], joinTo: "", join: [], isolate: []});
    }

    submitData() {
        this.setState({waiting: true});

        let globalPromise = new Promise((resolve, reject) => {
            let array = this.state.global;
            if (array.length === 0)
                resolve();
            let promises = [];
            for (let i = 0; i < array.length; i++) {
                promises.push(changeNetwork(array[i], "global"));
            }
            Promise.all(promises).then(() => resolve(), () => reject());
        });

        let makePromise = new Promise((resolve, reject) => {
            let array = this.state.join;
            if (array.length === 0 || this.state.joinTo === "")
                resolve();
            let promises = [];
            for (let i = 0; i < array.length; i++) {
                promises.push(changeNetwork(array[i], "join:" + this.state.joinTo));
            }
            Promise.all(promises).then(() => resolve(), () => reject());
        });

        let isolatePromise = new Promise((resolve, reject) => {
            let array = this.state.isolate;
            if (array.length === 0)
                resolve();
            let promises = [];
            for (let i = 0; i < array.length; i++) {
                promises.push(changeNetwork(array[i], "isolate"));
            }
            Promise.all(promises).then(() => resolve(), () => reject());
        });

        Promise.all([globalPromise, makePromise, isolatePromise])
            .then(() => {
                this.clearData()
            })
            .finally(() => this.setState({waiting: false}));
    }

    render() {
        let globalProperty = getNamespacePropertyOption();
        globalProperty.accessor = "";
        globalProperty.label = "设置全局可访问网络";
        globalProperty.isArray = true;

        let makeToProperty = getNamespacePropertyOption();
        makeToProperty.accessor = "";
        makeToProperty.label = "连通至";

        let makeFromProperty = getNamespacePropertyOption();
        makeFromProperty.isArray = true;
        makeFromProperty.accessor = "";
        makeFromProperty.label = "选择连通项目";

        let isolateProperty = getNamespacePropertyOption();
        isolateProperty.isArray = true;
        isolateProperty.label = "隔离项目网络";
        isolateProperty.accessor = "";

        return (
            <ContentWrapper>
                <div className="content-heading">
                    项目网络设置
                    <ol className="breadcrumb">
                        <li><Link to="project-network-view">多租户网络管理</Link></li>
                        <li>项目网络设置</li>
                    </ol>
                </div>
                <form className="form-horizontal">
                    <fieldset disabled={this.state.waiting}>
                        <Row>
                            <Col lg={12}>
                                <PropertyEditor option={globalProperty} onChange={(data) => {
                                    this.setState({global: data})
                                }} value={this.state.global} isCreate={false}/>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <label className="col-lg-2 control-label"><strong>连通项目网络</strong></label>
                            <Col lg={10}>
                                <PropertyEditor option={makeToProperty} onChange={(data) => {
                                    this.setState({joinTo: data})
                                }} value={this.state.joinTo} isCreate={false}/>
                                <br/>
                                <PropertyEditor option={makeFromProperty}
                                                onChange={(data) => this.setState({join: data})}
                                                value={this.state.join}/>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col lg={12}>
                                <PropertyEditor option={isolateProperty}
                                                onChange={(data) => this.setState({isolate: data})}
                                                value={this.state.isolate}/>
                            </Col>
                        </Row>
                        <Row>
                            <div className="pull-right">
                                <Button bsClass="btn btn-labeled btn-success mr" onClick={this.submitData}>
                                    确认
                                </Button>
                                <Button bsClass="btn btn-labeled btn-default mr" onClick={this.clearData}>
                                    重置
                                </Button>
                            </div>
                        </Row>
                    </fieldset>
                </form>
            </ContentWrapper>
        );
    }
}

/**
 *
 * @param {string} name name of the project that is going to be changed
 * @param operationName values are 'join:<projectName>', 'isolate', 'global'
 * @return {Promise<any>}
 */
function changeNetwork(name, operationName) {
    return new Promise((resolve, reject) => {
        apiClient().then((client) => {
            client.netnamespaces.get(name).then((data) => {
                if (typeof data.metadata.annotations === 'undefined') {
                    data.metadata.annotations = {};
                }
                data.metadata.annotations["pod.network.openshift.io/multitenant.change-network"] = operationName;
                return client.netnamespaces.update(data, name);
            }, () => reject())
                .then((data) => {
                    console.log(data);
                    let timerId = setInterval(() => {
                        client.netnamespaces.get(name).then((obj) => {
                            console.log(obj);
                            if (typeof obj.metadata.annotations === 'undefined'
                                || typeof obj.metadata.annotations["pod.network.openshift.io/multitenant.change-network"] === 'undefined') {
                                //this indicate the operation is completed
                                clearTimeout(timerId);
                                resolve();
                            }
                        })
                    }, 100)
                }, () => reject())
        }, () => reject())
    })
}

export default ProjectNetworkSetting;