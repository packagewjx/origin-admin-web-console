/**
 Date: 3/7/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";
import {PredefinedPropertyOption} from "../Common/PredifinedPropertyOption";

class IdentityDetail extends React.Component {
    render() {


        return (
            <ResourceDetail resourceName="identities" objectName={this.props.params.name}
                            propertyOptions={PredefinedPropertyOption.identities}/>
        );
    }
}

export default IdentityDetail;