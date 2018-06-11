var React = require('react');
import ContentWrapper from '../Layout/ContentWrapper';
import {Col, Row} from 'react-bootstrap';

class SubMenu extends React.Component {

    render() {
        return (
            <ContentWrapper>
                <h3>Sub Menu
                   <small>Subtitle</small>
                </h3>
                <Row>
                   <Col lg={12}>
                      <p>A row with content</p>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default SubMenu;
