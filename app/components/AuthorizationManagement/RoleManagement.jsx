/**
 Date: 2/26/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {TableConfig} from "../Common/ResourceOverview/TableConfig";
import PropertyOption from "../Common/PropertyOption";

class RoleManagement extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            'name',
            'creationTimestamp',
            'namespace'
        ];
        let propertyOptions = [
            new PropertyOption("metadata.name", "角色名", "text"),
            new PropertyOption("metadata.namespace", "名称空间")
        ];

        return (
            <ResourceOverview title={"角色管理"} resourceName={"roles"} tableConfig={tableConfig}/>
        )
        
        
    }
}


export default RoleManagement;