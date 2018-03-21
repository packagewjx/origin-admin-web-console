/**
 Date: 3/19/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";

class PodOverview extends React.Component {
    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            new ColumnConfig("名称", "metadata.name"),
            "namespace",
            "creationTimestamp",
            new ColumnConfig("容器IP", "status.podIP"),
            new ColumnConfig("容器状态", "status.phase"),
            new ColumnConfig("所在节点IP", "status.hostIP"),
        ];

        return (
            <ResourceOverview title={"容器列表"} resourceName={"pods"} tableConfig={tableConfig} disableCreate={true}
                              disableDelete={true}/>
        );
    }
}

export default PodOverview;