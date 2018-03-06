/**
 Date: 2/26/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description: This Component is used to display all resource of a certain kind(user, role, project...) of Openshift,
 displaying its major properties.
 **/

import React from 'react';
import ContentWrapper from "../../Layout/ContentWrapper";
import PropTypes from "prop-types"
import {DefaultColumnConfig, TableConfig} from "./TableConfig";
import {apiClient, GlobalOption} from "../../Utils/ApiClient/apiClient";
import Link from "react-router/es/Link";
import ReactTable from "react-table";
import {Button, Modal} from "react-bootstrap";
import ResourceEditor from "../ResourceEditor/ResourceEditor";
import PropertyOption from "../PropertyOption";

/**
 * This component is used to display all resource objects of a kind of resource. They are displayed in a table. The
 * table is defined using TableConfig, which defines what fields will be displayed and how, in the column.
 * @see TableConfig
 */
class ResourceOverview extends React.Component {
    constructor(props) {
        super(props);

        this.submitNewResource = this.submitNewResource.bind(this);
        this.fetchData = this.fetchData.bind(this);

        this.state = {data: [], loading: true, showAddResourceModal: false};

        //fetch data
        this.fetchData();

        //initialize add resource modal
        this.newResourceObject = {};

        // changing ColumnConfig, set to default and replace value.
        this.columns = [];
        for (let i = 0; i < this.props.tableConfig.columns.length; i++) {
            /**
             * @type {ColumnConfig}
             */
            let column = this.props.tableConfig.columns[i];
            if (typeof column === 'string') {
                if (DefaultColumnConfig.hasOwnProperty(column)) {
                    column = this.props.tableConfig.columns[i] = DefaultColumnConfig[column];
                } else {
                    console.error("Error, this column is not one of keys of DefaultColumnConfig");
                }
            }
            // add render function if not exist
            column.renderFunction = column.renderFunction || renderItem;
            if (typeof column.linkTo === 'string' && column.linkTo !== "") {
                // replace <<resourceName>> in linkTo to real resource name
                column.linkTo = column.linkTo.replace("<<resourceName>>", this.props.resourceName);
            }

            this.columns.push({
                Cell: row => <Cell row={row} referer={column.referer} linkTo={column.linkTo}
                                   renderFunction={column.renderFunction}/>,
                Header: column.title,
                accessor: column.referer,
                filterable: true
            });
        }
    }

    closeAddResourceModal() {
        this.setState({showAddResourceModal: false});
    }

    showAddResourceModal() {
        this.newResourceObject = this.props.getNewResourceObject ? this.props.getNewResourceObject() : {};
        this.setState({showAddResourceModal: !this.state.showAddResourceModal})
    }

    /**
     * Fetch Resource Objects
     */
    fetchData() {
        let resourceName = this.props.resourceName;
        let self = this;
        apiClient().then(function (client) {
            client[resourceName].list().then(function (data) {
                console.log(data);
                self.setState({data: data.items, loading: false});
            }, function () {
                self.setState({loading: false});
            })
        });
    }

    /**
     *
     * @param data new data object
     * @return {Promise<any>} Return a promise to be used in Resource Editor
     */
    submitNewResource(data) {
        let self = this;
        return new Promise((resolve, reject) => {
            apiClient().then(function (client) {
                //if this resource is namespaced, we should use the global options.
                let option = new GlobalOption();
                if (client[self.props.resourceName].spec.namespaced) {
                    if (data.metadata.namespace) {
                        option.namespace = data.metadata.namespace;
                    } else {
                        console.error("Error, Should set namespace");
                        reject();
                        return;
                    }
                }
                client[self.props.resourceName].create(data, option).then(
                    function () {
                        //if success, close this modal and fetch new data
                        self.closeAddResourceModal();
                        self.fetchData();
                        resolve();
                    }, function () {
                        //if failed, do not close modal, and reject this promise.
                        reject();
                    }
                );
            });
        });
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    {this.props.title}
                </div>
                <p>
                    <Button bsStyle="success" onClick={this.showAddResourceModal.bind(this)}>
                        <em className="fa fa-plus"/> 添加一项
                    </Button>
                </p>
                <ReactTable
                    data={this.state.data}
                    loading={this.state.loading}
                    columns={this.columns}
                    defaultPageSize={10}
                    previousText="上一页"
                    nextText="下一页"
                    loadingText="获取数据中"
                    noDataText="无数据"
                    pageText="第"
                    ofText="页共"
                    rowsText="行"
                />
                <Modal show={this.state.showAddResourceModal} onHide={this.closeAddResourceModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>添加一项</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ResourceEditor item={this.newResourceObject} onConfirm={this.submitNewResource}
                                        onCancel={this.closeAddResourceModal.bind(this)}
                                        propertyOptions={this.props.propertyOptions} isCreate={true}/>
                    </Modal.Body>
                </Modal>
            </ContentWrapper>
        );
    }
}

/**
 * Cell Component to render in the react table
 * @param props
 * @returns {*}
 * @constructor
 */
function Cell(props) {
    return props.renderFunction(props.row.original, props.referer, props.linkTo);
}

/**
 * Default render function, based on referer and linkTo
 * @param item
 * @param referer
 * @param linkTo
 * @returns {*}
 */
function renderItem(item, referer, linkTo) {
    let data = getData(item, referer);
    if (typeof linkTo === 'string' && linkTo !== "") {
        //replace {referer} to item.referer, if any
        let reg = /{([^}]+)}/g;
        linkTo = linkTo.replace(reg, function (match, $1) {
            return getData(item, $1);
        });

        return (
            <Link to={linkTo}>{data}</Link>
        )
    } else {
        return (
            <span>{data}</span>
        );
    }
}

/**
 * using the referer to retrieve data for a column.
 * TODO replace this method with accessData function in UtilFunctions.
 * @param {any} item
 * @param {String} referer
 * @return {String | Object}
 */
function getData(item, referer) {
    let keys = referer.split(".");
    let cur = item;
    for (let i = 0; i < keys.length; i++) {
        if (cur[keys[i]] !== undefined) {
            cur = cur[keys[i]];
        } else {
            console.warn("This item do not have ", referer);
            console.warn(item);
            return "";
        }
    }
    return cur;
}

ResourceOverview.propTypes = {
    title: PropTypes.string.isRequired,
    resourceName: PropTypes.string.isRequired,
    tableConfig: PropTypes.instanceOf(TableConfig).isRequired,
    /**
     * defines the PropertyOptions to edit the new object of this kind.
     */
    propertyOptions: PropTypes.arrayOf(PropTypes.instanceOf(PropertyOption)),
    /**
     * This function is used to create a new object of this kind. It does not have any arguments, and returns the new
     * Object.
     * @type {function():any}
     */
    getNewResourceObject: PropTypes.func
};

export default ResourceOverview;