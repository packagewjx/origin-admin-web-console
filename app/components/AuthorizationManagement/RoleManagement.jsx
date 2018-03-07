/**
 Date: 2/26/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {TableConfig} from "../Common/ResourceOverview/TableConfig";
import {PredefinedPropertyOption} from "../Common/PredifinedPropertyOption";
import Role from "../Utils/ApiClient/model/Role";

class RoleManagement extends React.Component {
    constructor(props) {
        super(props);

        this.tableConfig = new TableConfig();
        this.tableConfig.columns = [
            'namespacedName',
            'creationTimestamp',
            'namespace'
        ];
    }

    static getNewRole() {
        let role = new Role();
        role.rules = [];
        return role;
    }

    render() {

        let propertyOptions = PredefinedPropertyOption.roles;

        return (
            <ResourceOverview title={"角色管理"} resourceName={"roles"} tableConfig={this.tableConfig}
                              propertyOptions={propertyOptions}
                              getNewResourceObject={RoleManagement.getNewRole}/>
        )
        
        
    }
}


export default RoleManagement;