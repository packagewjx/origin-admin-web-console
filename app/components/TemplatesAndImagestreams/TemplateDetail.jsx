/**
 Date: 3/10/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";

class TemplateDetail extends React.Component {
    render() {
        let propertyOptions = PredefinedPropertyOption.templates();

        return (
            <ResourceDetail resourceName={"templates"} objectName={this.props.params.name}
                            namespace={this.props.params.namespace} propertyOptions={propertyOptions}/>
        );
    }
}

export default TemplateDetail;