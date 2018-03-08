/**
 Date: 3/4/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";

class UserDetail extends React.Component {
    render() {
        let propertyOptions = PredefinedPropertyOption.users();

        return (
            <ResourceDetail propertyOptions={propertyOptions} resourceName="users" objectName={this.props.params.name}/>
        );
    }
}

export default UserDetail;