/**
 Date: 3/19/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ContentWrapper from "../Layout/ContentWrapper";
import {TableConfig} from "../Common/ResourceOverview/TableConfig";

class NodeOverview extends React.Component {
    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "name"
        ];


        return (
            <ContentWrapper/>
        );
    }
}

export default NodeOverview;