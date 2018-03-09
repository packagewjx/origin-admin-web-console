/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";

class PersistentStorageDetail extends React.Component {
    render() {
        let options = PredefinedPropertyOption.persistentvolumes();

        return (
            <ResourceDetail resourceName={"persistentvolumes"} objectName={this.props.params.name}
                            propertyOptions={options}/>
        );
    }
}

export default PersistentStorageDetail;