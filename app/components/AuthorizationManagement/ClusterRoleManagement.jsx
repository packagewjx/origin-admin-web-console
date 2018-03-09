/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import ClusterRole from "../Utils/ApiClient/model/ClusterRole";

class ClusterRoleManagement extends React.Component {
    render() {
        let options = PredefinedPropertyOption.clusterroles();

        let tableConfigs = new TableConfig();
        tableConfigs.columns = [
            "name",
            new ColumnConfig("描述", "metadata.annotations.openshift\\.io/description")
        ];

        let newObject = () => {
            return new ClusterRole();
        };

        return (
            <ResourceOverview title="集群角色管理" resourceName="clusterroles" tableConfig={tableConfigs}
                              propertyOptions={options} getNewResourceObject={newObject}
            />
        );
    }
}

export default ClusterRoleManagement;