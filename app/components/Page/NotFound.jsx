import React from 'react';
import {History, Link} from 'react-router';

class NotFound extends React.Component {

    render() {
        return (
            <div className="abs-center wd-xl">
                <div className="text-center mb-xl">
                    <div className="text-lg mb-lg">404</div>
                    <img height={150} src="../../img/tan90.png"/>
                </div>
                <ul className="list-inline text-center text-sm mb-xl">
                    <li><Link to="welcome" className="text-muted">返回首页</Link></li>
                    <li className="text-muted">|</li>
                    <li><a style={{cursor: "pointer"}} className="text-muted" onClick={() => {
                        this.props.router.goBack()
                    }}>返回上一页</a></li>
                </ul>
            </div>
        );
    }

}

export default NotFound;

