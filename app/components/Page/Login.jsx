import React from 'react';
import {History} from 'react-router';
import {apiClient, setAccessToken} from "../Utils/ApiClient/apiClient";
import {appHistory} from "../../App";

let tokenRequestURL = "https://116.56.140.108:8443/oauth/token/request";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.doLogin = this.doLogin.bind(this);

        this.state = {notAdmin: false, credentialWrong: false};
    }


    doLogin() {
        //first clear the state, assume is right
        this.setState({notAdmin: false, credentialWrong: false});
        let password = $("#inputPassword").val();
        let username = $("#inputUsername").val();
        let base64 = btoa(username + ":" + password);
        let self = this;
        $.ajax(tokenRequestURL, {
            headers: {
                Authorization: "Basic " + base64
            },
            success: function (data, status, xhr) {
                let match = new RegExp("<code>(.*)</code>").exec(data);
                if (typeof match !== 'undefined') {
                    setAccessToken(match[1]);
                    //test this token with get user request
                    apiClient().then(function (client) {
                        client.users.list().then(function () {
                            appHistory.replace("/");
                        }, function () {
                            self.setState({notAdmin: true});
                        })
                    });
                } else {
                    //no match, no code
                    self.setState({credentialWrong: true});
                }

            },
            error: function (xhr, status, error) {

            },
        });
    }

    render() {
        return (
            <div className="block-center mt-xl wd-xl">
                {/* START panel */}
                <div className="panel panel-dark panel-flat">
                    <div className="panel-heading text-center">
                        <a href="#">
                            <img src="img/logo.png" alt="Image" className="block-center img-rounded"/>
                        </a>
                    </div>
                    <div className="panel-body">
                        <p className="text-center pv">请登录管理员帐号</p>
                        <form role="form" className="mb-lg">
                            <div className="form-group has-feedback">
                                <input id="inputUsername" type="test" placeholder="用户名" required="required"
                                       className="form-control"/>
                                <span className="fa fa-envelope form-control-feedback text-muted"/>
                            </div>
                            <div className="form-group has-feedback">
                                <input id="inputPassword" type="password" placeholder="密码" required="required"
                                       className="form-control"/>
                                <span className="fa fa-lock form-control-feedback text-muted"/>
                            </div>
                            {this.state.notAdmin ? <p className="text-danger">此帐号无管理员权限</p> : null}
                            {this.state.credentialWrong ? <p className="text-danger">用户名或密码错误</p> : null}
                            <button type="button" className="btn btn-block btn-primary mt-lg"
                                    onClick={this.doLogin}>登录
                            </button>
                        </form>
                    </div>
                </div>
                {/* END panel */}
            </div>
        );
    }

}

export default Login;
