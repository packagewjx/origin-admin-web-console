import React from 'react';
import {Router, Route, Link, History, withRouter} from 'react-router';
import pubsub from 'pubsub-js';
import {Collapse} from 'react-bootstrap';
import SidebarRun from './Sidebar.run';

class Sidebar extends React.Component {

    constructor(props, context) {
        super(props, context);

        //For dynamic menu rendering.
        this.menu = [
            {kind: "item", route: "singleview", title: "Single View", iconClass: "icon-grid"},
            {
                kind: "submenu", name: "submenu", title: "Menu", iconClass: "icon-speedometer", children: [
                    {kind: "item", route: "submenu", title: "Submenu", iconClass: "icon-grid"}
                ]
            },
            {
                kind: "submenu", name: "auth", title: "权限管理", iconClass: "icon-shield", children: [
                    {kind: "item", route: "users", title: "用户管理", iconClass: "icon-people"},
                    {kind: "item", route: "roles", title: "角色管理", iconClass: "fa fa-male"}
                ]
            }
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
    }

    navigator(route) {
        this.props.router.push(route)
    }

    componentWillUnmount() {
        // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
        pubsub.unsubscribe(this.pubsub_token);
    }

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        for (let p in paths) {
            if (this.props.router.isActive(paths[p]) === true)
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
        if (!item.kind || item.kind !== 'item'){
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
                    <li className={this.routeActive(routes) ? 'active' : ''}>
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
                            {/* START user info */}
                            <li className="has-user-block">
                                <Collapse id="user-block" in={this.state.userBlockCollapse}>
                                    <div>
                                        <div className="item user-block">
                                            {/* User picture */}
                                            <div className="user-block-picture">
                                                <div className="user-block-status">
                                                    <img src="img/user/02.jpg" alt="Avatar" width="60" height="60"
                                                         className="img-thumbnail img-circle"/>
                                                    <div className="circle circle-success circle-lg"></div>
                                                </div>
                                            </div>
                                            {/* Name and Job */}
                                            <div className="user-block-info">
                                                <span className="user-block-name">Hello, Mike</span>
                                                <span className="user-block-role">Designer</span>
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                            </li>
                            {/* END user info */}

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

