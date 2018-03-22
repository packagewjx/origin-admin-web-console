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
import {Button, Col, Dropdown, MenuItem, Modal, Row} from "react-bootstrap";
import {accessData} from "../../Utils/UtilFunctions";
import ResourceEditor from "../ResourceEditor/ResourceEditor";
import {PredefinedPropertyOption} from "../PredefinedPropertyOption";
import {FieldDisplayer} from "../FieldDisplayer";
import {Link} from "react-router";
import {appHistory} from "../../../App";

/**
 * This component is used to display a certain object. It will get the object specified by resourceName, namespace and
 * name using the apiClient. Then it will display it using the PropertyOptions supplied. By default, it will display
 * the metadata of this object. And generate a button on top-right, to edit this object, or delete this object.
 */
class ResourceDetail extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.onMenuItemClicked = this.onMenuItemClicked.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.updateItem = this.updateItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

        this.state = {item: {}, editModalShow: false, deleteModalShow: false};

        //menu action setting
        this.actions = [
            {
                label: "编辑", func: (data) => {
                    //get the newest data when we start do edit
                    this.fetchData().then((data) => {
                        this.setState({editModalShow: true})
                    });
                }
            },
            {
                label: "删除", func: (data) => {
                    //this action is delete
                    this.setState({deleteModalShow: true});
                }
            }
        ];
        this.actions = this.actions.concat(this.props.additionalActions || []);

        //fill the api props with functions.
        if (typeof this.props.api === 'object') {
            Object.assign(this.props.api, {
                refreshData: () => {
                    return this.fetchData();
                },
                getData: () => {
                    return this.state.item
                }
            });
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        let self = this;
        return new Promise(resolve => {
            apiClient().then(function (client) {
                let option = new GlobalOption();
                option.invalidateCache = true;
                if (self.props.namespace) {
                    option.namespace = self.props.namespace;
                }
                client[self.props.resourceName].get(self.props.objectName, option).then((data) => {
                    self.setState({item: data}, () => {
                        resolve(data);
                    });
                });
            })
        });

    }

    updateItem(data) {
        let self = this;
        return new Promise((resolve, reject) => {
            apiClient().then(function (client) {
                let option = new GlobalOption();
                if (self.props.namespace) {
                    option.namespace = self.props.namespace;
                }
                client[self.props.resourceName].update(data, self.props.objectName, option).then(function (data, status, xhr) {
                    resolve();
                    self.setState({item: data, editModalShow: false});
                }, () => reject());
            }, () => reject());
        });
    }

    deleteItem() {
        let self = this;
        return new Promise(resolve => {
            apiClient().then(function (client) {
                let option = new GlobalOption();
                if (self.props.namespace) {
                    option.namespace = self.props.namespace;
                }
                client[self.props.resourceName].delete(self.props.objectName, option).then(function (data) {
                    resolve();
                    appHistory.replace("/" + self.props.resourceName);
                });
            });
        });
    }

    onMenuItemClicked(eventKey, event) {
        this.actions[eventKey].func(this.state.item);
    }

    closeEditModal() {
        this.setState({editModalShow: false});
    }

    closeDeleteModal() {
        this.setState({deleteModalShow: false});
    }

    render() {
        let objectMetaPropertyOptions = [
            new PropertyOption("metadata.name", "名称", "text"),
            new PropertyOption("metadata.generateName", "系统生成名", "text"),
            new PropertyOption("metadata.namespace", "项目", "text"),
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
            //if undefined, by default, not to display this.
            fieldsDisplay.push(<FieldDisplayer key={i} option={options[i]}
                                               value={accessData(this.state.item, options[i].accessor)}/>)
        }

        //render breadcrumb
        let breadcrumbs = [];
        breadcrumbs.push(<li key="1"><Link to={"/" + this.props.resourceName}>{this.props.resourceName}</Link></li>);
        if (this.props.namespace)
            breadcrumbs.push(<li key="2">{this.props.namespace}</li>);
        breadcrumbs.push(<li key="3">{this.props.objectName}</li>);

        //render menuItems
        let menuItems = [];
        for (let i = 0; i < this.actions.length; i++) {
            menuItems.push(<MenuItem key={i} eventKey={i}>{this.actions[i].label}</MenuItem>)
        }


        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div className="pull-right">
                        <Dropdown id="dropdown-tr" pullRight onSelect={this.onMenuItemClicked}>
                            <Dropdown.Toggle>
                                操作
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {menuItems}
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
                {this.props.children}
                <Modal show={this.state.editModalShow} onHide={this.closeEditModal} backdrop={"static"}
                       bsSize={"large"}>
                    <Modal.Header closeButton>
                        <Modal.Title>编辑</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ResourceEditor item={this.state.item} onCancel={this.closeEditModal}
                                        onConfirm={this.updateItem}
                                        propertyOptions={PredefinedPropertyOption[this.props.resourceName]()}/>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.deleteModalShow} onHide={this.closeDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>确认删除</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        确认要删除{this.props.objectName}吗?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.deleteItem}>确认</Button>
                        <Button onClick={this.closeDeleteModal}>取消</Button>
                    </Modal.Footer>
                </Modal>
            </ContentWrapper>
        );
    }
}

ResourceDetail.propTypes = {
    /**
     * Resource name, in plural
     */
    resourceName: PropTypes.string.isRequired,
    /**
     * Resource object name
     */
    objectName: PropTypes.string.isRequired,
    /**
     * The namespace that this object belongs to.
     */
    namespace: PropTypes.string,
    /**
     * To display the object, this component will use PropertyOptions to display it, use the display options.
     */
    propertyOptions: PropTypes.arrayOf(PropTypes.instanceOf(PropertyOption)),
    /**
     * By default, there are two action, edit and delete. You can add more operation through this props, each element
     * of this array contains a function named that has one argument, which is the data this page displaying, and the name
     * of this action. Normally, you can add children to this ResourceDetail, which contains the modal you need to display
     * these actions's UI. Children will be placed below the content. Or you can just go to another page.
     * @type {Array.<{label:string, func:function(data:any)}>}
     */
    additionalActions: PropTypes.arrayOf(PropTypes.object),
    /**
     * API to control this element. Contains following functions
     * refreshData():Promise  a function to call to retrieve data from server and re-render, returns a promise,
     * onFulFilled has one argument, is the data item this page is displaying.
     * getData():any  return this page's displaying data.
     */
    api: PropTypes.object,
};

export default ResourceDetail;