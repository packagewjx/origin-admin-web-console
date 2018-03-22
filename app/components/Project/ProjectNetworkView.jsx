/**
 Date: 3/13/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ContentWrapper from "../Layout/ContentWrapper";
import {apiClient} from "../Utils/ApiClient/apiClient";
import ReactTable from "react-table";
import {Button} from "react-bootstrap";

class ProjectNetworkView extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);

        this.state = {data: [], projectDisplayName: {}};
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        apiClient().then((client) => {
            client.netnamespaces.list().then((data) => {
                this.setState({data: data.items});
            });
            client.namespaces.list().then((data) => {
                let map = {};
                for (let i = 0; i < data.items.length; i++) {
                    let project = data.items[i];
                    map[project.metadata.name] = project.metadata.annotations["openshift.io/display-name"];
                }
                this.setState({projectDisplayName: map});
            });
        })
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    多租户网络管理
                    <div className="pull-right">
                        <Button onClick={() => {
                            this.props.router.push("project-network-setting")
                        }}>网络设置</Button>
                    </div>
                </div>
                <div>
                    下面表格显示了各个项目的网络id，网络id的意义如下：
                    <ul>
                        <li>网络id为0的项目，可以被任何其他项目的容器所访问，也可以访问其他项目下的容器。</li>
                        <li>id不为0时，如果多个项目有着相同的id，则这些项目之间可以互相访问。</li>
                    </ul>
                </div>
                <ReactTable
                    data={this.state.data}
                    columns={[
                        {
                            Header: "项目网络id",
                            id: "netid",
                            accessor: "netid",
                            maxWidth: 150
                        },
                        {
                            Header: "项目数",
                            accessor: () => 1,
                            id: "number",
                            aggregate: (values) => values.reduce((preVal, curVal) => preVal + curVal),
                            Aggregated: row => {
                                return (<span>{row.value}</span>);
                            },
                            maxWidth: 100
                        },
                        {
                            Header: "项目名",
                            Aggregated: (props) => {
                                let resultStr = "";
                                for (let i = 0; i < props.subRows.length; i++) {
                                    let name = props.subRows[i]._original.metadata.name;
                                    if (this.state.projectDisplayName[name]) {
                                        resultStr += this.state.projectDisplayName[name] + "(" + name + ")";
                                    } else
                                        resultStr += name;
                                    resultStr += i < props.subRows.length - 1 ? "," : "";
                                }
                                return <span>{resultStr}</span>
                            },
                            Cell: (props) => {
                                if (typeof props.original === "undefined")
                                    return (<span/>);
                                let name = props.original.metadata.name;
                                if (this.state.projectDisplayName[name])
                                    return (<span>{this.state.projectDisplayName[name]}({name})</span>);
                                else
                                    return <span>{name}</span>
                            },
                            filterable: true
                        },
                    ]}
                    pivotBy={["netid"]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    previousText="上一页"
                    nextText="下一页"
                    loadingText="获取数据中"
                    noDataText="无数据"
                    pageText="第"
                    ofText="页共"
                    rowsText="行"
                />
            </ContentWrapper>
        );
    }
}

export default ProjectNetworkView;