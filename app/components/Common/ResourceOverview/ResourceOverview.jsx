/**
 Date: 2/26/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description: This Component is used to display all resource of a certain kind(user, role, project...) of Openshift,
 displaying its major properties.
 **/

import React from 'react';
import ContentWrapper from "../../Layout/ContentWrapper";
import PropTypes from "prop-types"

class ResourceOverview extends React.Component {


    render() {

        return (
            <ContentWrapper>
                <div className="content-heading">
                    资源总览
                </div>
            </ContentWrapper>
        );
    }
}

ResourceOverview.propTypes = {
    title: PropTypes.string,
    resourceKind: PropTypes.string,
    listFunction: PropTypes.func,

};


export default ResourceOverview;