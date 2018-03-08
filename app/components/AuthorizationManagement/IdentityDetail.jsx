/**
 Date: 3/7/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";
import {PredefinedPropertyOption} from "../Common/PredifinedPropertyOption";
import AskModal from "../Common/AskModal";

class IdentityDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {show: false}
    }

    render() {
        let actions = [
            {
                label: "关联用户", func: () => {
                    this.setState({show: true});
                }
            }
        ];

        return (
            <ResourceDetail resourceName="identities" objectName={this.props.params.name}
                            propertyOptions={PredefinedPropertyOption.identities} additionalActions={actions}>
                <AskModal onConfirm={() => {
                    return true;
                }} message={"hey"} show={this.state.show}/>
            </ResourceDetail>
        );
    }
}

export default IdentityDetail;