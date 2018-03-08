/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ClusterRoleBinding from "../Utils/ApiClient/model/ClusterRoleBinding";

class ClusterRoleBindingDetail extends React.Component {
    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "name",
            new ColumnConfig("关联角色", "roleRef.name", "clusterroles/{roleRef.name}"),
            new ColumnConfig("关联用户", "userNames"),
            new ColumnConfig("关联组", "groupNames")
        ];

        let option = PredefinedPropertyOption.clusterrolebindings();

        return (
            <ResourceOverview title="集群用户绑定" resourceName="clusterrolebindings" tableConfig={tableConfig}
                              propertyOptions={option} getNewResourceObject={() => {
                return new ClusterRoleBinding();
            }}/>
        );
    }
}

export default ClusterRoleBindingDetail;