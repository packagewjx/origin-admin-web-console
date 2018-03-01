/**
 Date: 3/1/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import PropTypes from 'prop-types';
import PropertyOption from "../PropertyOption";
import ContentWrapper from "../../Layout/ContentWrapper";
import {apiClient, GlobalOption} from "../../Utils/ApiClient/apiClient";

class ResourceDetail extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);

        this.state = {item: {}};
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        apiClient().then(function (client) {
            let option = new GlobalOption();
            if (this.props.namespace) {
                option.namespace = this.props.namespace;
            }
            client[this.props.resourceName].get(this.props.objectName, option).then(function (data) {
                this.setState({item: data});
            });
        })
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    {this.props.objectName}
                </div>

            </ContentWrapper>
        );
    }
}

ResourceDetail.propTypes = {
    resourceName: PropTypes.string, isRequired,
    objectName: PropTypes.string.isRequired,
    namespace: PropTypes.string,
    propertyOptions: PropTypes.arrayOf(PropTypes.instanceOf(PropertyOption))
};

export default ResourceDetail;