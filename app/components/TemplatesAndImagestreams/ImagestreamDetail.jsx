/**
 Date: 3/10/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import PropertyOption from "../Common/PropertyOption";
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";

class ImagestreamDetail extends React.Component {
    render() {
        let propertyOptions = PredefinedPropertyOption.imagestreams();
        let statusOption = new PropertyOption("status", "状态", "object");
        statusOption.immutable = true;
        propertyOptions.push(statusOption);


        return (
            <ResourceDetail resourceName={"imagestreams"} objectName={this.props.params.name}
                            propertyOptions={propertyOptions} namespace={this.props.params.namespace}/>
        );
    }
}

export default ImagestreamDetail;