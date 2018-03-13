/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ContentWrapper from "../Layout/ContentWrapper";
import {Button, Col, Row} from "react-bootstrap";
import PropertyEditor from "../Common/ResourceEditor/PropertyEditor";
import PropertyOption from "../Common/PropertyOption";
import {apiClient} from "../Utils/ApiClient/apiClient";

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
        let namespaceSelections = getNamespaceSelection();
        let globalProperty = new PropertyOption("", "设置全局可访问网络", "select");
        globalProperty.isArray = true;
        globalProperty.selections = namespaceSelections;

        let makeToProperty = new PropertyOption("", "连通至", "select");
        makeToProperty.selections = namespaceSelections;

        let makeFromProperty = new PropertyOption("", "选择连通项目", "select");
        makeFromProperty.isArray = true;
        makeFromProperty.selections = namespaceSelections;

        let isolateProperty = new PropertyOption("", "隔离项目网络", "select");
        isolateProperty.isArray = true;
        isolateProperty.selections = namespaceSelections;

        return (
            <ContentWrapper>
                <div className="content-heading">
                    项目网络设置
                </div>
                <form className="form-horizontal">
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
                            <PropertyEditor option={makeFromProperty} onChange={(data) => this.setState({join: data})}
                                            value={this.state.join}/>
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col lg={12}>
                            <PropertyEditor option={isolateProperty} onChange={(data) => this.setState({isolate: data})}
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
                </form>
            </ContentWrapper>
        );
    }
}

function getNamespaceSelection() {
    return new Promise((resolve, reject) => {
        apiClient().then((client) => {
            client.projects.list().then((data) => {
                let selections = [];
                for (let i = 0; i < data.items.length; i++) {
                    selections.push({label: data.items[i].metadata.name, value: data.items[i].metadata.name});
                }
                resolve(selections);
            }, () => reject());
        }, () => reject())
    })
}

function isolateProject(name) {
    return new Promise((resolve, reject) => {
        apiClient().then((client) => {
            client.netnamespaces.get(name).then((data) => {
                if (typeof data.metadata.annotations === 'undefined') {
                    data.metadata.annotations = {};
                }
                data.metadata.annotations["pod.network.openshift.io/multitenant.change-network"] = "isolate";
                return client.netnamespaces.update(data, name);
            }, () => reject())
                .then((data) => {
                    let timerId = setInterval(() => {
                        client.netnamespaces.get(name).then((obj) => {
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