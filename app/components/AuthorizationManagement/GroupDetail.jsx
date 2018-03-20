/**
 Date: 3/20/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";

class GroupDetail extends React.Component {
    render() {
        let propertyOption = PredefinedPropertyOption.groups();
        let name = this.props.params.name;

        return (
            <ResourceDetail resourceName={"groups"} objectName={name} propertyOptions={propertyOption}/>
        );
    }
}

export default GroupDetail;