import React from 'react';
import {History, Link, withRouter} from 'react-router';
import pubsub from 'pubsub-js';
import {Collapse} from 'react-bootstrap';
import SidebarRun from './Sidebar.run';

class Sidebar extends React.Component {

    constructor(props, context) {
        super(props, context);

        //For dynamic menu rendering.
        this.menu = [{
            kind: "submenu", name: "auth", title: "权限管理", iconClass: "fa fa-users", children: [
                {kind: "item", route: "users", title: "用户管理", iconClass: ""},
                {kind: "item", route: "identities", title: "用户身份管理"},
                {kind: "item", route: "groups", title: "用户组管理"},
                {kind: "item", route: "roles", title: "项目角色管理"},
                {kind: "item", route: "rolebindings", title: "项目角色绑定管理"},
                {kind: "item", route: "clusterroles", title: "集群角色管理"},
                {kind: "item", route: "clusterrolebindings", title: "集群角色绑定管理"},
            ]
        },
            {
                kind: "submenu", name: "persistent-storage", title: "持久存储管理", iconClass: "fa fa-hdd-o", children: [
                    {kind: "item", route: "persistentvolumes", title: "持久卷管理"},
                    {kind: "item", route: "persistentvolumeclaims", title: "查看持久卷申请"},
                ]
            },
            {
                kind: "submenu", name: "template-imagestream", title: "镜像流与模板管理", iconClass: "fa fa-tags", children: [
                    {kind: "item", route: "templates", title: "模板管理"},
                    {kind: "item", route: "imagestreams", title: "镜像流管理"}
                ]
            },
            {
                kind: "submenu", name: "project", title: "项目管理", iconClass: "fa fa-briefcase", children: [
                    {kind: "item", route: "projects", title: "项目列表"},
                    {kind: "item", route: "project-network-view", title: "多租户网络管理"},
                    {kind: "item", route: "pods", title: "容器列表"},
                    {kind: "item", route: "resourcequotas", title: "项目配额管理"},
                ]
            },
            {kind: "item", route: "monitor", title: "集群监控", iconClass: "fa fa-desktop"},
        ];

        this.state = {
            userBlockCollapse: false,
            collapse: {}
        };
        this.pubsub_token = pubsub.subscribe('toggleUserblock', () => {
            this.setState({
                userBlockCollapse: !this.state.userBlockCollapse
            });
        });
    };

    componentDidMount() {
        // pass navigator to access router api
        SidebarRun(this.navigator.bind(this));

        //find the current active route, and toggle the collapse
        for (let i = 0; i < this.menu.length; i++) {
            if (this.menu[i].kind === "submenu") {
                for (let j = 0; j < this.menu[i].children.length; j++) {
                    if (this.routeActive(this.menu[i].children[j].route)) {
                        this.toggleItemCollapse(this.menu[i].name);
                        return;
                    }
                }
            }
        }
    }

    navigator(route) {
        this.props.router.push(route)
    }

    componentWillUnmount() {
        // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
        pubsub.unsubscribe(this.pubsub_token);
    }

    routeActive(paths) {
        let pathname = this.props.router.location.pathname;
        paths = Array.isArray(paths) ? paths : [paths];
        for (let p in paths) {
            if (pathname.startsWith(paths[p]))
                return true;
        }
        return false;
    }

    toggleItemCollapse(stateName) {
        var newCollapseState = {};
        for (let c in this.state.collapse) {
            if (this.state.collapse[c] === true && c !== stateName)
                this.state.collapse[c] = false;
        }
        this.setState({
            collapse: {
                [stateName]: !this.state.collapse[stateName]
            }
        });
    }

    toMenuItem(item) {
        if (!item.kind || item.kind !== 'item') {
            console.error("Not of a menu item", item);
            return (<li/>);
        }

        return (
            <li key={item.route} className={this.routeActive(item.route) ? 'active' : ''}>
                <Link to={item.route} title={item.title}>
                    <em className={item.iconClass || ""}/>
                    <span>{item.title}</span>
                </Link>
            </li>
        );
    }

    render() {
        let navMenu = [];
        for (let i = 0; i < this.menu.length; i++) {
            let item = this.menu[i];
            if (item.kind === 'item') {
                navMenu.push(
                    this.toMenuItem(item)
                );
            } else if (item.kind === 'submenu') {
                let subMenuItems = [];
                let routes = [];
                for (let j = 0; j < item.children.length; j++) {
                    subMenuItems.push(this.toMenuItem(item.children[j]));
                    routes.push(item.children[j].route);
                }
                navMenu.push(
                    <li key={item.name} className={this.routeActive(routes) ? 'active' : ''}>
                        <div className="nav-item" onClick={this.toggleItemCollapse.bind(this, item.name)}>
                            <em className={item.iconClass}/>
                            <span>{item.title}</span>
                        </div>
                        <Collapse in={this.state.collapse[item.name]} timeout={100}>
                            <ul id={item.name} className="nav sidebar-subnav">
                                {subMenuItems}
                            </ul>
                        </Collapse>
                    </li>
                );
            }
        }


        return (
            <aside className='aside'>
                {/* START Sidebar (left) */}
                <div className="aside-inner">
                    <nav data-sidebar-anyclick-close="" className="sidebar">
                        {/* START sidebar nav */}
                        <ul className="nav">
                            {navMenu}
                        </ul>
                        {/* END sidebar nav */}
                    </nav>
                </div>
                {/* END Sidebar (left) */}
            </aside>
        );
    }

}

export default withRouter(Sidebar);

