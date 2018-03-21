/**
 Date: 3/19/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";

class NodeOverview extends React.Component {
    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            new ColumnConfig("节点名", "metadata.name"),
            new ColumnConfig("节点IP", "status.addresses", "", (row) => {
                let addresses = row.status.addresses;
                for (let i = 0; i < addresses.length; i++) {
                    if (addresses[i].type === "InternalIP") {
                        return (<span>{addresses[i].address}</span>)
                    }
                }
                return null;
            }),
            new ColumnConfig("CPU个数", "status.allocatable.cpu"),
            new ColumnConfig("内存大小", "status.allocatable.memory", "", (row) => {
                let memory = row.status.allocatable.memory;
                let match = /(\d+)Ki/.exec(memory);
                if (match !== null) {
                    console.log(match);
                    let memoryInGi = (parseInt(match[1]) / 1048576).toFixed(2);
                    return (<span>{memoryInGi}Gi</span>);
                }
            })
        ];


        return (
            <ResourceOverview title={"节点查看"} resourceName={"nodes"} tableConfig={tableConfig} disableDelete={true}
                              disableCreate={true}/>
        );
    }
}

export default NodeOverview;