/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";

class PersistentStorageOverview extends React.Component {
    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "name",
            new ColumnConfig("存取模式", "spec.accessModes"),
            new ColumnConfig("容量", "spec.capacity.storage"),
            new ColumnConfig("状态", "status.phase"),
            new ColumnConfig("使用者", "spec.claimRef.name"),
            new ColumnConfig("再利用策略", "spec.persistentVolumeReclaimPolicy")
        ];

        let propertyOptions = PredefinedPropertyOption.persistentvolumes();
        propertyOptions.splice(4, 2);

        return (
            <ResourceOverview title={"持久卷管理"} resourceName={"persistentvolumes"} tableConfig={tableConfig}
                              propertyOptions={propertyOptions}/>
        );
    }
}

export default PersistentStorageOverview;