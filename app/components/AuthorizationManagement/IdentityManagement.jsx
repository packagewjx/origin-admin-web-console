/**
 Date: 3/7/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";

class IdentityManagement extends React.Component {
    constructor(props) {
        super(props);

        this.tableConfig = new TableConfig();
        this.tableConfig.columns = [
            "name",
            new ColumnConfig("关联用户", "user.name", "users/{user.name}"),
            new ColumnConfig("身份提供方", "providerName"),
            new ColumnConfig("身份提供方用户名", "providerUserName")
        ];
    }

    render() {
        return (
            <ResourceOverview title="用户身份管理" resourceName="identities" tableConfig={this.tableConfig}/>
        );
    }
}

export default IdentityManagement;