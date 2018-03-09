/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";

class RoleBindingDetail extends React.Component {
    render() {
        let option = PredefinedPropertyOption.rolebindings();

        return (
            <ResourceDetail resourceName={"rolebindings"} objectName={this.props.params.name}
                            namespace={this.props.params.namespace} propertyOptions={option}
            />
        );
    }
}

export default RoleBindingDetail;