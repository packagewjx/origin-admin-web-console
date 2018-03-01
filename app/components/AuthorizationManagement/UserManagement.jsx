/**
 Date: 2/26/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ContentWrapper from "../Layout/ContentWrapper";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import User from "../Utils/ApiClient/model/User";

class UserManagement extends React.Component {

    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "name",
            "creationTimestamp",
            new ColumnConfig("用户身份", "identities")
        ];

        return (
            <ResourceOverview getNewResourceObject={getNewUser} resourceName={"users"} tableConfig={tableConfig} title="用户管理"/>
        );
    }
}

function getNewUser() {
    let user = new User();
    user.groups = [];
    user.identities = [];
    user.metadata.name = "";
    return user;
}

export default UserManagement;