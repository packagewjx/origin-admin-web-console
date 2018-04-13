import React from 'react';
import {apiClient, setAccessToken} from "../Utils/ApiClient/apiClient";
import {appHistory} from "../../App";
import {OPENSHIFT_MASTER_API_URL} from "../Common/constants";

let oauthClientId = "origin-admin-web-console";
let oauthClientSecret = "wujunxian";
let oauthRedirectUri = "http://localhost:3000/login/";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.checkToken = this.checkToken.bind(this);

        this.state = {notAdmin: false};
    }

    componentDidMount() {
        /**
         * If an access token is present, we just use it.
         */
        let match = /access_token=([^&]*)/.exec(this.props.location.hash);
        if (match !== null)
            this.checkToken(match[1]);
    }


    checkToken(token) {
        let self = this;
        setAccessToken(token);
        //test this token with get user request
        apiClient().then(function (client) {
            client.users.list().then(() => {
                appHistory.replace("/");
                //store the token
                $.localStorage.set("token", token);
            }, () => {
                self.setState({notAdmin: true});
            })
        });
    }

    render() {
        let loginArea = (
            <div className="panel-body">
                <p className="text-center pv">请登录管理员帐号</p>
                <button type="button" className="btn btn-block btn-primary mt-lg" onClick={() => {
                    window.location.assign(OPENSHIFT_MASTER_API_URL + "/oauth/authorize?client_id=" + oauthClientId
                        + "&client_secret=" + oauthClientSecret
                        + "&response_type=token"
                        + "&redirect_uri=" + oauthRedirectUri);
                }}>
                    使用容器云帐号登录
                </button>
                {this.state.notAdmin ? <p className="text-danger">此帐号无管理员权限</p> : null}
            </div>
        );

        let oauthCallbackArea = (
            <div className="panel-body">
                <p className="text-center pv">请稍侯...</p>
            </div>
        );

        return (
            <div className="block-center mt-xl wd-xl">
                {/* START panel */}
                <div className="panel panel-info panel-flat">
                    <div className="panel-heading text-center">
                        <a href="#">
                            <img src="../../img/innovationbasetitlelogo.png" height={40} width={280} alt="Image"
                                 className="block-center img-rounded"/>
                        </a>
                    </div>
                    {typeof this.props.location.query.code !== 'undefined' ? oauthCallbackArea : loginArea}
                </div>
                {/* END panel */}
            </div>
        );
    }

}

export default Login;
