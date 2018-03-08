/**
 Date: 3/7/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import ResourceDetail from "../Common/ResourceDatail/ResourceDetail";
import PropTypes from 'prop-types';
import {PredefinedPropertyOption} from "../Common/PredefinedPropertyOption";
import {Button, Col, FormControl, FormGroup, Modal} from "react-bootstrap";
import {apiClient} from "../Utils/ApiClient/apiClient";
import UserIdentityMapping from "../Utils/ApiClient/model/UserIdentityMapping";
import ObjectReference from "../Utils/ApiClient/model/ObjectReference";

class IdentityDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {showBindUserModal: false};
        this.resourceDetailAPI = {};
    }


    render() {
        let actions = [{
            label: "关联用户", func: () => {
                this.setState({showBindUserModal: true});
            }
        }];

        return (
            <ResourceDetail resourceName="identities" objectName={this.props.params.name}
                            propertyOptions={PredefinedPropertyOption.identities()} additionalActions={actions}
                            api={this.resourceDetailAPI}>
                <BindUserModal show={this.state.showBindUserModal}
                               onHide={() => {
                                   this.setState({showBindUserModal: false});
                                   this.resourceDetailAPI.refreshData();
                               }}
                               identityName={this.props.params.name}/>
            </ResourceDetail>
        );
    }
}

class BindUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.bindUser = this.bindUser.bind(this);
        this.unbindUser = this.unbindUser.bind(this);

        this.state = {
            showBindUserModal: props.show,
            users: [],
            mappedUser: "",
            originalMapping: null,
            waiting: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showBindUserModal: nextProps.show});
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount() {
        this.setState({showBindUserModal: false});
    }

    fetchData() {
        this.setState({waiting: true});
        apiClient().then((client) => {
            let p1 = client.useridentitymappings.get(this.props.identityName);
            p1.then((data) => {
                //only when data is exist, will display unbind button.
                this.setState({mappedUser: data.user.name, originalMapping: data});
            });
            let p2 = client.users.list();
            p2.then((data) => {
                this.setState({users: data.items});
            });
            // when all promise fulfilled, then is not waiting
            Promise.all([p1, p2]).finally(() => {
                this.setState({waiting: false});
            });
        })
    }

    closeBindUserModal() {
        this.setState({showBindUserModal: false});
        this.props.onHide();
    }

    /**
     * Delete the binding of this identity.
     * @return {Promise<any>}
     */
    unbindUser() {
        this.setState({waiting: true});
        return new Promise(resolve => {
            apiClient().then((client) => {
                client["useridentitymappings"].delete(this.props.identityName).then((data) => {
                    // clear all mapping data.
                    this.setState({originalMapping: null, mappedUser: ""});
                    this.closeBindUserModal();
                    resolve();
                }).always(() => this.setState({waiting: false}));//set to not waiting in finally
            })
        });
    }

    /**
     * Bind the identity to a user. If exists, unbind it first.
     */
    bindUser() {
        this.setState({waiting: true});
        let selectedUser = this.state.mappedUser;
        let doBind = () => {
            let mapping = new UserIdentityMapping();
            let userRef = new ObjectReference();
            userRef.name = selectedUser;
            let identityRef = new ObjectReference();
            identityRef.name = this.props.identityName;
            mapping.user = userRef;
            mapping.identity = identityRef;
            mapping.metadata.name = this.props.identityName;

            apiClient().then((client) => {
                client.useridentitymappings.create(mapping).then((data) => {
                    this.setState({originalMapping: data, mappedUser: data.user.name});
                    this.closeBindUserModal();
                }).always(() => this.setState({waiting: false}));
            })
        };

        if (this.state.originalMapping !== null) {
            //if already bind a user, unbind it first.
            this.unbindUser().then(doBind)
        } else {
            doBind();
        }
    }

    handleUserChange(event) {
        this.setState({mappedUser: event.target.value});
    }

    render() {
        let userOptions = [];
        let users = this.state.users;
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            userOptions.push(<option key={user.metadata.name} label={user.metadata.name} value={user.metadata.name}/>)
        }

        return (
            <Modal show={this.state.showBindUserModal} onHide={this.closeBindUserModal.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>关联用户</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form role="form" className="form-horizontal">
                        <fieldset disabled={this.state.waiting}>
                            <FormGroup>
                                <label className="col-sm-2 control-label">关联用户</label>
                                <Col sm={10}>
                                    <FormControl onChange={this.handleUserChange.bind(this)}
                                                 componentClass="select"
                                                 value={this.state.mappedUser}>
                                        <option value=""/>
                                        {userOptions}
                                    </FormControl>
                                </Col>
                            </FormGroup>
                        </fieldset>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <fieldset disabled={this.state.waiting}>
                        <Button disabled={this.state.mappedUser === ""} bsStyle="primary"
                                onClick={this.bindUser}>确认</Button>
                        <Button disabled={this.state.originalMapping === null} bsStyle="danger"
                                onClick={this.unbindUser}>删除关联</Button>
                        <Button onClick={this.closeBindUserModal.bind(this)}>取消</Button>
                    </fieldset>
                </Modal.Footer>
            </Modal>
        );
    }
}

BindUserModal.propTypes = {
    show: PropTypes.bool,
    identityName: PropTypes.string,
    /**
     * The modal will decide when to hide itself, not its parent, so parent get noticed when onHide is called.
     * parent should set its show state to false
     */
    onHide: PropTypes.func,
};

export default IdentityDetail;