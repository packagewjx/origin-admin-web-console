/**
 Date: 3/7/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResponsiveIFrame from "./Common/ResponsiveIFrame";

class ServerMonitor extends React.Component {
    render() {
        return (
            <ResponsiveIFrame src="https://116.56.140.108:9090"/>
        );
    }
}

export default ServerMonitor;