/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import {apiClient} from "../Utils/ApiClient/apiClient";
import Link from "react-router/es/Link";
import RoleBinding from "../Utils/ApiClient/model/RoleBinding";

class RoleBindingManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {clusterRoleNames: {}, roleNames: {}};
    }

    componentDidMount() {
        apiClient().then((client) => {
            let result = {};
            let p1 = client.clusterroles.list();
            p1.then((data) => {
                let clusterRoleNames = {};
                for (let i = 0; i < data.items.length; i++) {
                    clusterRoleNames[data.items[i].metadata.name] = true;
                }
                result.clusterRoleNames = clusterRoleNames;
            });
            let p2 = client.roles.list();
            p2.then((data) => {
                let roleNames = {};
                for (let i = 0; i < data.items.length; i++) {
                    roleNames[data.items[i].metadata.name] = true;
                }
                result.roleNames = roleNames;
            });

            Promise.all([p1, p2]).then(() => {
                this.setState(result);
            })
        });
    }

    render() {
        let roleBindingOptions = PredefinedPropertyOption.rolebindings();
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "namespace",
            'namespacedName',
            new ColumnConfig("关联角色", "roleRef.name", undefined, (item) => {
                if (this.state.clusterRoleNames[item.roleRef.name]) {
                    return (<Link to={"clusterroles/" + item.roleRef.name}>{item.roleRef.name}</Link>)
                } else if (this.state.roleNames[item.roleRef.name]) {
                    return (<Link
                        to={"roles/namespaces/" + item.metadata.namespace + "/" + item.roleRef.name}>{item.roleRef.name}</Link>)
                } else {
                    return (<span>{item.roleRef.name}</span>)
                }
            }),
            new ColumnConfig("关联用户/服务账户", "userNames"),
            new ColumnConfig("关联组", "groupNames"),
        ];


        return (
            <ResourceOverview title="项目角色绑定" resourceName="rolebindings" tableConfig={tableConfig}
                              propertyOptions={roleBindingOptions}
                              getNewResourceObject={() => new RoleBinding()}/>
        );
    }
}

export default RoleBindingManagement;