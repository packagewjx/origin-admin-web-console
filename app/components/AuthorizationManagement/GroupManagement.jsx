/**
 Date: 3/20/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import Group from "../Utils/ApiClient/model/Group";

class GroupManagement extends React.Component {
    render() {
        let propertyOption = PredefinedPropertyOption.groups();
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "name",
            new ColumnConfig("组内用户", "users")
        ];

        return (
            <ResourceOverview title={"用户组管理"} resourceName={"groups"} tableConfig={tableConfig}
                              propertyOptions={propertyOption} getNewResourceObject={() => new Group()}/>
        );
    }
}

export default GroupManagement;