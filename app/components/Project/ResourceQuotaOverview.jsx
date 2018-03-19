/**
 Date: 3/19/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {TableConfig} from "../Common/ResourceOverview/TableConfig";
import ResourceQuota from "../Utils/ApiClient/model/ResourceQuota";

class ResourceQuotaOverview extends React.Component {
    render() {
        let propertyOptions = PredefinedPropertyOption.resourcequotas();
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "namespacedName",
            "namespace",
        ];

        return (
            <ResourceOverview title={"项目配额管理"} resourceName={"resourcequotas"} tableConfig={tableConfig}
                              propertyOptions={propertyOptions} getNewResourceObject={() => new ResourceQuota()}/>
        );
    }
}

export default ResourceQuotaOverview;