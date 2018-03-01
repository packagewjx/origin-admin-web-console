/**
 Date: 2/26/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import User from "../Utils/ApiClient/model/User";
import PropertyOption from "../Common/PropertyOption";
import {apiClient} from "../Utils/ApiClient/apiClient";

class UserManagement extends React.Component {

    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "name",
            "creationTimestamp",
            new ColumnConfig("用户身份", "identities")
        ];

        let propertyOptions = [
            new PropertyOption("metadata.name", "用户名", "text"),
            new PropertyOption("identities", "用户身份", "select")
        ];

        propertyOptions[1].selections = new Promise(resolve => {
            apiClient().then(function (client) {
                client.identities.list().then(function (data) {
                    let selections = [];
                    for (let i = 0; i < data.items.length; i++) {
                        let item = data.items[i];
                        selections.push({label: item.metadata.name, value: item.metadata.name});
                    }
                    resolve(selections);
                })
            })
        });
        propertyOptions[1].isArray = true;


        return (
            <ResourceOverview getNewResourceObject={getNewUser} propertyOptions={propertyOptions} resourceName={"users"}
                              tableConfig={tableConfig} title="用户管理"/>
        );
    }
}

function getNewUser() {
    let user = new User();
    user.groups = [];
    user.identities = [];
    user.metadata.name = "";
    user.gender = "";
    return user;
}

export default UserManagement;