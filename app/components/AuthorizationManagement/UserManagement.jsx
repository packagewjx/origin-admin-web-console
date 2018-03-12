/**
 Date: 2/26/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceOverview from "../Common/ResourceOverview/ResourceOverview";
import {ColumnConfig, TableConfig} from "../Common/ResourceOverview/TableConfig";
import User from "../Utils/ApiClient/model/User";
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import {Button, Col, FormControl, FormGroup, Modal} from "react-bootstrap";
import {BACKEND_BASE_ADDRESS} from "../Common/constants";
import {apiClient, getToken} from "../Utils/ApiClient/apiClient";
import Identity from "../Utils/ApiClient/model/Identity";
import UserIdentityMapping from "../Utils/ApiClient/model/UserIdentityMapping";

class UserManagement extends React.Component {

    render() {
        let tableConfig = new TableConfig();
        tableConfig.columns = [
            "name",
            "creationTimestamp",
            new ColumnConfig("用户身份", "identities")
        ];

        let propertyOptions = PredefinedPropertyOption.users();
        propertyOptions.splice(1, 2);

        let additionalButtons = [<CreateUserButton key={"abc"}/>];

        return (
            <ResourceOverview getNewResourceObject={getNewUser} propertyOptions={propertyOptions} resourceName={"users"}
                              tableConfig={tableConfig} title="用户管理" disableCreate={true}
                              additionalButtons={additionalButtons}/>
        );
    }
}

class CreateUserButton extends React.Component {

    constructor(props) {
        super(props);
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createUser = this.createUser.bind(this);

        this.state = {modalShow: false, username: "", password: "", password2: "", passwordNotEqual: false};
    }

    createUser() {
        if (this.state.password !== this.state.password2) {
            this.setState({passwordNotEqual: true});
            return;
        }

        this.setState({waiting: true, passwordNotEqual: false});

        console.log(this.state);

        let htpasswdIdentity = {username: this.state.username, password: this.state.password};
        let p1 = $.ajax(BACKEND_BASE_ADDRESS + "/htpasswdidentities", {
            method: "POST",
            contentType: "application/json",
            headers: {authorization: getToken()},
            data: JSON.stringify(htpasswdIdentity),
            success: () => this.setState({createdIdentityName: this.props.name}),
            error: (xhr) => console.log(xhr)
        });

        let p2 = new Promise((resolve, reject) => {
            apiClient().then((client) => {
                let user = new User();
                user.metadata.name = this.state.username;
                let p1 = client.users.create(user);
                p1.fail((xhr) => console.log(xhr));

                let identity = new Identity();
                identity.providerUserName = this.state.username;
                identity.providerName = "htpasswd";
                identity.metadata.name = "htpasswd" + ":" + this.state.username;
                let p2 = client.identities.create(identity);
                p2.fail((xhr) => console.log(xhr));

                let userIdentityMapping = new UserIdentityMapping();
                userIdentityMapping.user.name = this.state.username;
                userIdentityMapping.identity.name = identity.metadata.name;
                userIdentityMapping.metadata.name = identity.metadata.name;
                let p3 = client.useridentitymappings.create(userIdentityMapping);
                p3.fail((xhr) => console.log(xhr));

                Promise.all([p1, p2, p3]).then(() => {
                    resolve();
                }, () => reject());

            }, () => reject())
        });

        Promise.all([p1, p2]).then(() => this.setState({modalShow: false})).finally(() => this.setState({waiting: false}));
    }

    showModal() {
        this.setState({modalShow: true});
    }

    closeModal() {
        this.setState({modalShow: false});
    }

    render() {
        return (
            <Button bsStyle="success" onClick={this.showModal}>
                <em className="fa fa-plus"/> 新建用户
                <Modal show={this.state.modalShow} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>新建用户</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form-horizontal">
                            <FormGroup>
                                <label className="col-lg-2 control-label">用户名</label>
                                <Col lg={10}>
                                    <FormControl type="text" className="form-control"
                                                 onChange={(event) => this.setState({username: event.target.value})}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <label className="col-lg-2 control-label">密码</label>
                                <Col lg={10}>
                                    <FormControl type="password" className="form-control"
                                                 onChange={(event) => this.setState({password: event.target.value})}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <label className="col-lg-2 control-label">再次输入密码</label>
                                <Col lg={10}>
                                    <FormControl type="password" className="form-control"
                                                 onChange={(event) => this.setState({password2: event.target.value})}/>
                                    {this.state.passwordNotEqual ? <p className="text-danger">两次密码输入不一致</p> : null}
                                </Col>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={this.createUser}>创建</Button>
                        <Button onClick={this.closeModal}>取消</Button>
                    </Modal.Footer>
                </Modal>
            </Button>
        );
    }
}

function getNewUser() {
    let user = new User();
    user.groups = [];
    user.identities = [];
    user.metadata.name = "";
    user.gender = "";
    return user;
}

export default UserManagement;