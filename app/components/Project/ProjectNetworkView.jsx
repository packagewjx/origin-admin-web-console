/**
 Date: 3/13/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ContentWrapper from "../Layout/ContentWrapper";
import {apiClient} from "../Utils/ApiClient/apiClient";
import ReactTable from "react-table";

class ProjectNetworkView extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);

        this.state = {data: []};
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        apiClient().then((client) => {
            client.netnamespaces.list().then((data) => {
                this.setState({data: data.items});
            });
        })
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    查看项目网络
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
                            accessor: "metadata.name",
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