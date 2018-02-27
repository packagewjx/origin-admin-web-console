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
import {apiClient} from "../../Utils/ApiClient/apiClient";
import Link from "react-router/es/Link";
import ReactTable from "react-table";

class ResourceOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {data: [], loading: true};

        //fetch data
        let resourceName = this.props.resourceName;
        let self = this;
        apiClient().then(function (client) {
            client[resourceName].list().then(function (data) {
                console.log(data);
                self.setState({data: data.items, loading: false});
            })
        });

        this.columns = [];
        // changing ColumnConfig, set to default and replace value.
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
                console.log("here");
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

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    {this.props.title}
                </div>
                <ReactTable
                    data={this.state.data}
                    loading={this.state.loading}
                    columns={this.columns}
                    defaultPageSize={10}
                    previousText="上一页"
                    nextText="下一页"
                    loadingText="获取数据中"
                    noDataText="无数据"
                    pageText="页"
                    ofText="的"
                    rowsText="行"
                />
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
        //replace <<name>> to item name, if any
        linkTo = linkTo.replace("<<name>>", item.name || (item.metadata ? item.metadata.name : "") || "");
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
 * using the referer to retrieve data for a column
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
    tableConfig: PropTypes.instanceOf(TableConfig).isRequired
};


export default ResourceOverview;