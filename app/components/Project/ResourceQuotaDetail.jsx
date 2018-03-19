/**
 Date: 3/19/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";

class ResourceQuotaDetail extends React.Component {
    render() {
        let name = this.props.params.name;
        let namespace = this.props.params.namespace;


        return (
            <ResourceDetail resourceName={"resourcequotas"} objectName={name}
                            propertyOptions={PredefinedPropertyOption.resourcequotas()} namespace={namespace}/>
        );
    }
}

export default ResourceQuotaDetail;