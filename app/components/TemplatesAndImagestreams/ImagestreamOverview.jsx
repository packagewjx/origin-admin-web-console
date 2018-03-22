/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {TableConfig} from "../Common/ResourceOverview/TableConfig";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ImageStream from "../Utils/ApiClient/model/ImageStream";

class ImagestreamOverview extends React.Component {
    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "namespacedName",
            "projectDisplayName",
            "creationTimestamp"
        ];

        let propertyOptions = PredefinedPropertyOption.imagestreams();

        return (
            <ResourceOverview title={"镜像流管理"} resourceName={"imagestreams"} tableConfig={tableConfig}
                              propertyOptions={propertyOptions} getNewResourceObject={() => new ImageStream()}/>
        );
    }
}

export default ImagestreamOverview;