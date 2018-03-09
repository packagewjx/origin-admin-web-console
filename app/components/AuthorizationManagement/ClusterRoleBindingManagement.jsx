/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import ClusterRoleBinding from "../Utils/ApiClient/model/ClusterRoleBinding";

class ClusterRoleBindingManagement extends React.Component {
    render() {
        let option = PredefinedPropertyOption.clusterrolebindings();
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "name",
            new ColumnConfig("关联角色", "roleRef.name", "clusterroles/{roleRef.name}"),
            new ColumnConfig("关联用户", "userNames"),
            new ColumnConfig("关联组", "groupNames")
        ];

        return (
            <ResourceOverview title={"集群角色绑定"} resourceName={"clusterrolebindings"} tableConfig={tableConfig}
                              getNewResourceObject={() => new ClusterRoleBinding()} propertyOptions={option}/>
        );
    }
}

export default ClusterRoleBindingManagement;