/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";

class ClusterRoleDetail extends React.Component {
    render() {
        let option = PredefinedPropertyOption.clusterroles();

        return (
            <ResourceDetail resourceName="clusterroles" objectName={this.props.params.name} propertyOptions={option}
            />
        );
    }
}

export default ClusterRoleDetail;