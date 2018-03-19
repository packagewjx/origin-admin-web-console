/**
 Date: 3/19/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import Project from "../Utils/ApiClient/model/Project";

class ProjectOverview extends React.Component {
    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            new ColumnConfig("项目名", "metadata.name"),
            "creationTimestamp",
            new ColumnConfig("状态", "status.phase")
        ];

        return (
            <ResourceOverview title={"项目管理"} resourceName={"projects"} tableConfig={tableConfig}
                              propertyOptions={PredefinedPropertyOption.projects()}
                              getNewResourceObject={() => new Project()}/>
        );
    }
}

export default ProjectOverview;