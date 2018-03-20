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
import {accessData, deepClone, guid} from "../../Utils/UtilFunctions";
import ConfirmDialog from "../ConfirmDialog";
import Notify from "../Notify";

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
        this.isPageSelected = this.isPageSelected.bind(this);
        this.hasSelected = this.hasSelected.bind(this);
        this.deleteSelected = this.deleteSelected.bind(this);

        this.state = {
            data: [],
            loading: true,
            showAddResourceModal: false,
            selected: {},
            pageSelected: false,
            showDeleteSelectedModal: false,
            deleteSelectedWaiting: false
        };

        //store the pageSize, for changing checked in that page.
        this.pageSize = 10;
        this.pageIndex = 0;

        //initialize add resource modal
        this.newResourceObject = {};

        //fill the this.props.api with functions
        if (typeof props.api === 'object') {
            let api = {
                refresh: () => {
                    this.fetchData();
                },
                getData: () => {
                    return this.state.data;
                }
            };
            Object.assign(props.api, api);
        }
    }

    closeAddResourceModal() {
        this.setState({showAddResourceModal: false});
    }

    showAddResourceModal() {
        this.newResourceObject = this.props.getNewResourceObject ? this.props.getNewResourceObject() : {};
        this.setState({showAddResourceModal: !this.state.showAddResourceModal})
    }

    componentDidMount() {
        //fetch data
        this.fetchData();
    }

    /**
     * Fetch Resource Objects
     */
    fetchData() {
        let resourceName = this.props.resourceName;
        let self = this;
        apiClient().then(function (client) {
            client[resourceName].list({invalidateCache: true}).then(function (data) {
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

    /**
     * Check if anyone is selected.
     * @return {boolean}
     */
    hasSelected() {
        for (let key in this.state.selected) {
            if (this.state.selected.hasOwnProperty(key) && this.state.selected[key])
                return true;
        }
        return false;
    }

    /**
     * Check if one page is all selected.
     * @param pageIndex
     * @param pageSize
     * @return {boolean}
     */
    isPageSelected(pageIndex, pageSize) {
        for (let i = pageIndex * pageSize; i < pageIndex * pageSize + pageSize; i++) {
            if (!this.state.selected[i])
                return false;
        }
        return true;
    }

    /**
     * Delete all the selected resources.
     */
    deleteSelected() {
        let promises = [];
        let self = this;
        let selected = this.state.selected;
        this.setState({deleteSelectedWaiting: true});
        apiClient().then((client) => {
            for (let key in selected) {
                if (selected.hasOwnProperty(key) && selected[key] === true) {
                    let item = self.state.data[key];
                    let option = new GlobalOption();
                    if (typeof item.metadata.namespace === "string" && item.metadata.namespace !== "")
                        option.namespace = item.metadata.namespace;
                    console.debug(item);
                    promises.push(client[this.props.resourceName].delete(item.metadata.name, option));
                }
            }
            Promise.all(promises).then(() => {
                //clear select data and hide modal
                self.setState({showDeleteSelectedModal: false, selected: {}, pageSelected: false});
                Notify("删除成功", {status: "success", pos: "top-right"});
                self.fetchData();
            }).finally(() => self.setState({deleteSelectedWaiting: false}));
        });

    }

    render() {
        let self = this;
        // changing ColumnConfig, set to default and replace value.
        this.columns = [];
        // add checkbox column to the first column
        this.columns.push({
            /**
             * Single row checkbox
             * @param props
             * @return {*}
             * @constructor
             */
            Cell: function (props) {
                return (
                    <Checkbox value={self.state.selected[props.index]} onChange={(value) => {
                        let selected = self.state.selected;
                        selected[props.index] = value;
                        self.setState({selected, pageSelected: self.isPageSelected(self.pageIndex, self.pageSize)});
                    }}/>
                );
            },
            Header: function (props) {
                return (
                    <Checkbox value={self.state.pageSelected} onChange={(value) => {
                        let selected = self.state.selected;
                        for (let i = self.pageIndex * self.pageSize; i < self.pageIndex * self.pageSize + self.pageSize; i++) {
                            selected[i] = value;
                        }
                        self.setState({selected, pageSelected: value});
                    }}/>
                )
            },
            width: 40,
            sortable: false,
            filterable: false,
            resizable: false
        });

        for (let i = 0; i < this.props.tableConfig.columns.length; i++) {
            /**
             * @type {ColumnConfig}
             */
            let column = this.props.tableConfig.columns[i];
            if (typeof column === 'string') {
                if (DefaultColumnConfig.hasOwnProperty(column)) {
                    //because javascript is giving value, so ,we have to clone it, to prevent changing the DefaultColumnConfig
                    column = this.props.tableConfig.columns[i] = deepClone(DefaultColumnConfig[column]);
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


        return (
            <ContentWrapper>
                <div className="content-heading">
                    {this.props.title}
                </div>
                <div className="btn-toolbar">
                    {this.props.disableCreate ? null :
                        <Button bsStyle="success" onClick={this.showAddResourceModal.bind(this)}>
                            <em className="fa fa-plus"/> 添加一项
                        </Button>}
                    <Button onClick={this.fetchData}>
                        <em className="fa fa-refresh"/> 刷新
                    </Button>
                    {this.hasSelected() ?
                        <Button bsStyle="danger" onClick={() => {
                            this.setState({showDeleteSelectedModal: true})
                        }}>
                            <em className="fa fa-trash"/> 删除已选
                        </Button>
                        : null}
                    {this.props.additionalButtons}
                </div>
                <ReactTable
                    data={this.state.data}
                    loading={this.state.loading}
                    columns={this.columns}
                    defaultPageSize={this.pageSize}
                    previousText="上一页"
                    nextText="下一页"
                    loadingText="获取数据中"
                    noDataText="无数据"
                    pageText="第"
                    ofText="页共"
                    rowsText="行"
                    onPageChange={(pageIndex) => {
                        this.pageIndex = pageIndex;
                        this.setState({pageSelected: this.isPageSelected(pageIndex, this.pageSize)});
                    }}
                    onPageSizeChange={(pageSize, pageIndex) => {
                        this.pageIndex = pageIndex;
                        this.pageSize = pageSize;
                        this.setState({pageSelected: this.isPageSelected(pageIndex, pageSize)});
                    }}
                />
                <Modal show={this.state.showAddResourceModal}
                       onHide={this.closeAddResourceModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>添加一项</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ResourceEditor item={this.newResourceObject} onConfirm={this.submitNewResource}
                                        onCancel={this.closeAddResourceModal.bind(this)}
                                        propertyOptions={this.props.propertyOptions} isCreate={true}/>
                    </Modal.Body>
                </Modal>
                <ConfirmDialog onConfirm={this.deleteSelected} show={this.state.showDeleteSelectedModal}
                               confirmButtonStyle={"danger"}
                               onClose={() => {
                                   this.setState({showDeleteSelectedModal: false});
                               }} waiting={this.state.deleteSelectedWaiting}>
                    <strong>确认要删除已选对象吗？</strong>
                </ConfirmDialog>
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
    let data = accessData(item, referer);

    if (data instanceof Array) {
        let newData = "";
        for (let i = 0; i < data.length - 1; i++) {
            newData += data[i] + ",";
        }
        newData += data[data.length - 1];
        data = newData;
    }

    if (typeof linkTo === 'string' && linkTo !== "") {
        //replace {referer} to item.referer, if any
        let reg = /{([^}]+)}/g;
        linkTo = linkTo.replace(reg, function (match, $1) {
            return accessData(item, $1);
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

/**
 * A Controlled checkbox.
 */
class Checkbox extends React.Component {
    constructor(props) {
        super(props);

        this.uuid = guid();
    }

    render() {
        //use jquery to handle the change.
        $("#" + this.uuid).prop("checked", !!this.props.value);

        return (
            <div className="checkbox c-checkbox" style={{margin: 0, paddingLeft: 3}}>
                <label>
                    <input id={this.uuid} type="checkbox" style={{width: 0, height: 0}}
                           onChange={(event) => {
                               this.props.onChange(event.target.checked);
                           }}/>
                    <em className="fa fa-check"/></label>
            </div>
        )
    }
}

Checkbox.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.bool
};


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
    getNewResourceObject: PropTypes.func,
    disableCreate: PropTypes.bool,
    additionalButtons: PropTypes.array,
    /**
     * Resource Overview will fill this object with control functions of the following:
     * refresh():undefined  retrieve the latest data.
     * getData():Array.<any>  get the current display data.
     */
    api: PropTypes.object,
};

export default ResourceOverview;