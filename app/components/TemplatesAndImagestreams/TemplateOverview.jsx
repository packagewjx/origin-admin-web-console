/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import Template from "../Utils/ApiClient/model/Template";

class TemplateOverview extends React.Component {
    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "namespacedName",
            "projectDisplayName",
            new ColumnConfig("描述", "metadata.annotations.description")
        ];
        let propertyOptions = PredefinedPropertyOption.templates();


        return (
            <ResourceOverview resourceName={"templates"} title={"模板管理"} tableConfig={tableConfig}
                              propertyOptions={propertyOptions} getNewResourceObject={() => new Template()}/>
        );
    }
}

export default TemplateOverview;