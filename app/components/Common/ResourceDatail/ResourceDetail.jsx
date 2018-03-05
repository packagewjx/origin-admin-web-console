/**
 Date: 3/1/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import PropTypes from 'prop-types';
import PropertyOption from "../PropertyOption";
import ContentWrapper from "../../Layout/ContentWrapper";
import {apiClient, GlobalOption} from "../../Utils/ApiClient/apiClient";
import {Col, Dropdown, MenuItem, Modal, Row} from "react-bootstrap";
import {accessData} from "../../Utils/UtilFunctions";
import ResourceEditor from "../ResourceEditor/ResourceEditor";
import {PredefinedPropertyOption} from "../PredifinedPropertyOption";
import {FieldDisplayer} from "../FieldDisplayer";
import {Link} from "react-router";

class ResourceDetail extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.onMenuItemClicked = this.onMenuItemClicked.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

        this.state = {item: {}, editModalShow: false};
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        let self = this;
        apiClient().then(function (client) {
            let option = new GlobalOption();
            if (self.props.namespace) {
                option.namespace = self.props.namespace;
            }
            client[self.props.resourceName].get(self.props.objectName, option).then(function (data) {
                console.log(data);
                self.setState({item: data});
            });
        })
    }

    updateItem(data) {
        let self = this;
        apiClient().then(function (client) {
            client[self.props.resourceName].update(data);
        })
    }

    deleteItem() {
        let self = this;
        apiClient().then(function (client) {
            client[self.props.resourceName].delete(self.props.objectName).then(function (data) {
                console.log(data);
            })
        })
    }

    onMenuItemClicked(eventKey, event) {
        switch (eventKey) {
            case "1":
                this.setState({editModalShow: true});
                break;
            case "2":


        }
    }

    closeEditModal() {
        this.setState({editModalShow: false});
    }

    render() {
        let objectMetaPropertyOptions = [
            new PropertyOption("metadata.name", "名称", "text"),
            new PropertyOption("metadata.generateName", "系统生成名", "text"),
            new PropertyOption("metadata.namespace", "名称空间", "text"),
            new PropertyOption("metadata.selfLink", "对象URL", "text"),
            new PropertyOption("metadata.uid", "UID", "text"),
            new PropertyOption("metadata.resourceVersion", "资源版本号", "text"),
            new PropertyOption("metadata.generation", "资源代数", "text"),
            new PropertyOption("metadata.creationTimestamp", "创建时间戳", "text"),
            new PropertyOption("metadata.deletionTimestamp", "删除时间戳", "text"),
            new PropertyOption("metadata.annotations", "注释", "keyValue"),
            new PropertyOption("metadata.initializers", "初始化器", "text"),
            new PropertyOption("metadata.finalizers", "销毁器", "text"),
            new PropertyOption("metadata.clusterName", "所属集群", "text")
        ];
        let fieldsDisplay = [];

        let options = objectMetaPropertyOptions;
        for (let i = 0; i < this.props.propertyOptions.length; i++) {
            //add no metadata property option
            if (!this.props.propertyOptions[i].accessor.match(/metadata.*/))
                options.push(this.props.propertyOptions[i]);
        }

        for (let i = 0; i < options.length; i++) {
            options[i].value = accessData(this.state.item, options[i].accessor);
            //if undefined, by default, not to display this.
            fieldsDisplay.push(<FieldDisplayer key={i} option={options[i]}/>)
        }

        //render breadcrumb
        let breadcrumbs = [];
        breadcrumbs.push(<li key="1"><Link to={"/" + this.props.resourceName}>{this.props.resourceName}</Link></li>);
        if (this.props.namespace)
            breadcrumbs.push(<li key="2"><Link to={this.props.namespace}>{this.props.namespace}</Link></li>);
        breadcrumbs.push(<li key="3">{this.props.objectName}</li>);

        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div className="pull-right">
                        <Dropdown id="dropdown-tr" pullRight onSelect={this.onMenuItemClicked}>
                            <Dropdown.Toggle>
                                操作
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <MenuItem eventKey="1">编辑</MenuItem>
                                <MenuItem eventKey="2">删除</MenuItem>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    {this.props.objectName}
                    <ol className="breadcrumb">
                        {breadcrumbs}
                    </ol>
                </div>
                <Row>
                    <Col lg={12}>
                        {fieldsDisplay}
                    </Col>
                </Row>
                <Modal show={this.state.editModalShow} onHide={this.closeEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>编辑</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ResourceEditor item={this.state.item} onCancel={() => console.log(this.state.item)}
                                        onConfirm={this.updateItem}
                                        propertyOptions={PredefinedPropertyOption[this.props.resourceName]}/>
                    </Modal.Body>
                </Modal>
            </ContentWrapper>
        );
    }
}

ResourceDetail.propTypes = {
    resourceName: PropTypes.string.isRequired,
    objectName: PropTypes.string.isRequired,
    namespace: PropTypes.string,
    propertyOptions: PropTypes.arrayOf(PropTypes.instanceOf(PropertyOption))
};

export default ResourceDetail;