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
import UserManagement from "./components/AuthorizationManagement/UserManagement";
import RoleManagement from "./components/AuthorizationManagement/RoleManagement";
import UserDetail from "./components/AuthorizationManagement/UserDetail";
import RoleDetail from "./components/AuthorizationManagement/RoleDetail";
import WelcomeView from "./components/Welcome";
import ServerMonitor from "./components/ServerMonitor";
import IdentityManagement from "./components/AuthorizationManagement/IdentityManagement";
import IdentityDetail from "./components/AuthorizationManagement/IdentityDetail";
import RoleBindingManagement from "./components/AuthorizationManagement/RoleBindingManagement";
import RoleBindingDetail from "./components/AuthorizationManagement/RoleBindingDetail";
import ClusterRoleManagement from "./components/AuthorizationManagement/ClusterRoleManagement";
import ClusterRoleDetail from "./components/AuthorizationManagement/ClusterRoleDetail";
import ClusterRoleBindingManagement from "./components/AuthorizationManagement/ClusterRoleBindingManagement";
import ClusterRoleBindingDetail from "./components/AuthorizationManagement/ClusterRoleBindingDetail";
import ImagestreamOverview from "./components/TemplatesAndImagestreams/ImagestreamOverview";
import TemplateOverview from "./components/TemplatesAndImagestreams/TemplateOverview";
import PersistentVolumeOverview from "./components/PersistentStorage/PersistentVolumeOverview";
import ProjectNetworkSetting from "./components/ProjectNetwork/ProjectNetworkSetting";
import PersistentVolumeDetail from "./components/PersistentStorage/PersistentVolumeDetail";
import PersistentVolumeClaimOverview from "./components/PersistentStorage/PersistentVolumeClaimOverview";
import TemplateDetail from "./components/TemplatesAndImagestreams/TemplateDetail";
import ImagestreamDetail from "./components/TemplatesAndImagestreams/ImagestreamDetail";
import ProjectNetworkView from "./components/ProjectNetwork/ProjectNetworkView";

// Init css loader (for themes)
initLoadThemes();

// Init api client
apiClient().then(function (client) {
    console.log(client);
});

// Disable warning "Synchronous XMLHttpRequest on the main thread is deprecated.."
$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
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
            <Route path="identities" component={IdentityManagement}/>
            <Route path="identities/:name" component={IdentityDetail}/>
            <Route path="roles" component={RoleManagement}/>
            <Route path="roles/namespaces/:namespace/:name" components={RoleDetail}/>
            <Route path="rolebindings" component={RoleBindingManagement}/>
            <Route path="rolebindings/namespaces/:namespace/:name" component={RoleBindingDetail}/>
            <Route path="clusterroles" component={ClusterRoleManagement}/>
            <Route path="clusterroles/:name" component={ClusterRoleDetail}/>
            <Route path="clusterrolebindings" component={ClusterRoleBindingManagement}/>
            <Route path="clusterrolebindings/:name" component={ClusterRoleBindingDetail}/>

            {/*Persistent Storage*/}
            <Route path="persistentvolumes" component={PersistentVolumeOverview}/>
            <Route path="persistentvolumes/:name" component={PersistentVolumeDetail}/>
            <Route path="persistentvolumeclaims" component={PersistentVolumeClaimOverview}/>

            {/*模板管理*/}
            <Route path="imagestreams" component={ImagestreamOverview}/>
            <Route path="imagestreams/namespaces/:namespace/:name" component={ImagestreamDetail}/>
            <Route path="templates" component={TemplateOverview}/>
            <Route path="templates/namespaces/:namespace/:name" component={TemplateDetail}/>

            {/*项目管理*/}
            <Route path="resourcequotas"/>
            <Route path="pods"/>
            <Route path="projects"/>
            <Route path="nodes"/>

            {/*Project Network*/}
            <Route path="project-network-view" component={ProjectNetworkView}/>
            <Route path="project-network-setting" component={ProjectNetworkSetting}/>

            {/*Monitor*/}
            <Route path="monitor" component={ServerMonitor}/>
        </Route>

        <Route path="/" component={BasePage}>
            <Route path="login" component={Login}/>
        </Route>

        {/* Not found handler */}
        {/*<Route path="*" component={NotFound}/>*/}

        {/* Not found handler */}
        <Route path="*" component={NotFound}/>

    </Router>,
    document.getElementById('app')
);

// Auto close sidebar on route changes
appHistory.listen(function (ev) {
    $('body').removeClass('aside-toggled');
});
