/**
 Date: 3/6/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";

class RoleDetail extends React.Component {
    render() {
        let propertyOptions = PredefinedPropertyOption["roles"];
        return (
            <ResourceDetail propertyOptions={propertyOptions} namespace={this.props.params.namespace}
                            resourceName="roles" objectName={this.props.params.name}/>
        );
    }
}

export default RoleDetail;