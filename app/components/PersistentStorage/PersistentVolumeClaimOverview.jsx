/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";

class PersistentStorageClaimOverview extends React.Component {
    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            new ColumnConfig("名称", "metadata.name"),
            "projectDisplayName",
            new ColumnConfig("请求存取模式", "spec.accessModes"),
            new ColumnConfig("请求空间大小", "spec.resources.requests.storage"),
            new ColumnConfig("新建持久卷名", "spec.volumeName"),
            new ColumnConfig("状态", "status.phase"),
            new ColumnConfig("已分配卷的存储模式", "status.accessModes"),
            new ColumnConfig("已分配卷的空间", "status.capacity.storage")
        ];

        return (
            <ResourceOverview tableConfig={tableConfig} disableCreate={true} title={"查看持久卷申请"}
                              resourceName={"persistentvolumeclaims"}/>
        );
    }
}

export default PersistentStorageClaimOverview;