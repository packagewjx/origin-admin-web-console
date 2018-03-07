/*!
 *
 * Angle - Bootstrap Admin App + ReactJS
 *
 * Version: 3.7.5
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {IndexRedirect, Route, Router, useRouterHistory} from 'react-router';
import {createHistory} from 'history';

import initLoadThemes from './components/Common/load-themes';
import {apiClient, init} from './components/Utils/ApiClient/apiClient';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';
// Application Styles
import './styles/bootstrap.scss';
import './styles/app.scss'
import Login from "./components/Page/Login";
import NotFound from "./components/Page/NotFound";
import Register from "./components/Page/Register";
import UserManagement from "./components/AuthorizationManagement/UserManagement";
import RoleManagement from "./components/AuthorizationManagement/RoleManagement";
import ResourceOverview from "./components/Common/ResourceOverview/ResourceOverview";
import UserDetail from "./components/AuthorizationManagement/UserDetail";
import RoleDetail from "./components/AuthorizationManagement/RoleDetail";
import WelcomeView from "./components/Welcome";

// Init css loader (for themes)
initLoadThemes();

// Init api client
apiClient().then(function (client) {
    console.log(client);
});


// Disable warning "Synchronous XMLHttpRequest on the main thread is deprecated.."
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    options.async = true;
});

// specify basename below if running in a subdirectory or set as "/" if app runs in root
export const appHistory = useRouterHistory(createHistory)({
  basename: WP_BASE_HREF
});

ReactDOM.render(
    <Router history={appHistory}>
        <Route path="/" component={Base}>

            {/* Default route*/}
            <IndexRedirect to="/welcome"/>

            <Route path="welcome" component={WelcomeView}/>

            {/*权限管理*/}
            <Route path="users" component={UserManagement}/>
            <Route path="users/:name" components={UserDetail}/>
            <Route path="roles" component={RoleManagement}/>
            <Route path="roles/namespaces/:namespace/:name" components={RoleDetail}/>
            <Route path="overview" component={ResourceOverview}/>

            {/*/!*模板管理*!/*/}
            {/*<Route path="imagestreams"/>*/}
            {/*<Route path="templates"/>*/}


            <Route path="projectnetwork"/>


        </Route>

        <Route path="/" component={BasePage}>
            <Route path="login" component={Login}/>
            <Route path="register" component={Register}/>
        </Route>

        {/* Not found handler */}
        {/*<Route path="*" component={NotFound}/>*/}

        {/* Not found handler */}
        <Route path="*" component={NotFound}/>

    </Router>,
    document.getElementById('app')
);

// Auto close sidebar on route changes
appHistory.listen(function(ev) {
    $('body').removeClass('aside-toggled');
});
