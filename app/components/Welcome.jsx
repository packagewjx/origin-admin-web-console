import React from 'react';
import {Col, Row} from 'react-bootstrap';
import ContentWrapper from "./Layout/ContentWrapper";

class WelcomeView extends React.Component {

    render() {
        return (
            <ContentWrapper>
                <div>
                    <Row>
                        <Col xs={12} className="text-center">
                            <img src="../img/innovationbasetitlelogo.png"/>
                            <h2 className="text-thin">开发运维系统管理后台</h2>
                            <p>
                                请从左方导航菜单中进入需要的管理页
                            </p>
                        </Col>
                    </Row>
                </div>
            </ContentWrapper>
        );
    }
}

export default WelcomeView;
