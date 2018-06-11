/**
 Date: 3/7/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResponsiveIFrame from "./Common/ResponsiveIFrame";
import {COCKPIT_MONITOR_URL} from "./Common/constants";

class ServerMonitor extends React.Component {
    render() {
        return (
            <ResponsiveIFrame src={COCKPIT_MONITOR_URL}/>
        );
    }
}

export default ServerMonitor;