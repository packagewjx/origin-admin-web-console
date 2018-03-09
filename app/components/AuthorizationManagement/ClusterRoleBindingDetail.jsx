/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";

class ClusterRoleBindingDetail extends React.Component {
    render() {
        let option = PredefinedPropertyOption.clusterrolebindings();

        return (<ResourceDetail resourceName="clusterrolebindings" objectName={this.props.params.name}
                                propertyOptions={option}/>);
    }
}

export default ClusterRoleBindingDetail;