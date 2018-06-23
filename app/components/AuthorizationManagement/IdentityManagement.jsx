/**
 Date: 3/7/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import Identity from "../Utils/ApiClient/model/Identity";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import PropertyOption from "../Common/PropertyOption";
import {BACKEND_BASE_ADDRESS} from "../Common/constants";
import PropTypes from "prop-types";
import {getToken} from "../Utils/ApiClient/apiClient";
import {Button, Col, FormControl, FormGroup} from "react-bootstrap";

class IdentityManagement extends React.Component {
    constructor(props) {
        super(props);

        this.tableConfig = new TableConfig();
        this.tableConfig.columns = [
            "name",
            new ColumnConfig("关联用户", "user.name", "users/{user.name}"),
            new ColumnConfig("身份提供方", "providerName"),
            new ColumnConfig("身份提供方用户名", "providerUserName")
        ];

        this.propertyOptions = PredefinedPropertyOption.identities();
        this.propertyOptions.splice(1, 2);
        this.propertyOptions.splice(2, 1);
        let createDefaultIdentityOption = new PropertyOption("providerUserName");
        createDefaultIdentityOption.render = (username) => {
            return (<CreateDefaultIdentityRow name={username}/>)
        };
        this.propertyOptions.push(createDefaultIdentityOption);
    }

    render() {
        return (
            <ResourceOverview title="用户身份管理" resourceName="identities" tableConfig={this.tableConfig}
                              getNewResourceObject={() => {
                                  let identity = new Identity();
                                  identity.providerName = "username";
                                  identity.providerUserName = "";
                                  return identity;
                              }}
                              propertyOptions={this.propertyOptions}/>
        );
    }
}

class CreateDefaultIdentityRow extends React.Component {
    constructor(props) {
        super(props);

        this.createNewIdentity = this.createNewIdentity.bind(this);
        this.deleteIdentity = this.deleteIdentity.bind(this);

        this.state = {createdIdentityName: "", waiting: false, password: "", nullInput: false};
    }

    createNewIdentity() {
        if (this.props.name === "" || this.state.password === "") {
            this.setState({nullInput: true});
            return;
        }

        this.setState({waiting: true, nullInput: false});
        let identity = {username: this.props.name, password: this.state.password};

        $.ajax(BACKEND_BASE_ADDRESS + "/htpasswdidentities", {
            method: "POST",
            contentType: "application/json",
            headers: {authorization: getToken()},
            data: JSON.stringify(identity),
            complete: () => this.setState({waiting: false}),
            success: () => this.setState({createdIdentityName: this.props.name}),
            error: (xhr) => console.log(xhr)
        });
    }

    deleteIdentity() {
        this.setState({waiting: true});

        $.ajax(BACKEND_BASE_ADDRESS + "/htpasswdidentities/" + this.state.createdIdentityName, {
            method: "DELETE",
            headers: {authorization: getToken()},
            complete: () => this.setState({waiting: false}),
            success: () => this.setState({createdIdentityName: ""}),
            error: (xhr) => console.log(xhr)
        });

    }

    render() {
        return (
            <FormGroup>
                <label className="col-lg-2">创建默认身份密码</label>
                <Col lg={10}>
                    <FormControl type={"text"}
                                 onChange={(event) => this.setState({password: event.target.value, nullInput: false})}/>
                    <Button bsStyle="success" disabled={this.state.waiting}
                            onClick={this.createNewIdentity}>
                        {this.state.createdIdentityName === "" ? "创建" : "更新"}
                    </Button>
                    <Button disabled={this.state.createdIdentityName === "" || this.state.waiting} bsStyle="danger"
                            onClick={this.deleteIdentity}>
                        删除
                    </Button>
                    <br/>
                    {this.state.nullInput ? <p className="text-danger">请输入用户名和密码后继续</p> : null}
                </Col>
            </FormGroup>
        );
    }
}

CreateDefaultIdentityRow.propTypes = {
    name: PropTypes.string
};


export default IdentityManagement;