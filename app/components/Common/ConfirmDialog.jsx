/**
 Date: 3/20/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {Modal} from "react-bootstrap";
import PropTypes from "prop-types";
import Button from "react-bootstrap/es/Button";

/**
 * Use children to render some content in the modal. Control show using props show, it will not close it self unless you
 * set show to false. When closing button is clicked or the background is clicked, onClose method will be called.
 */
class ConfirmDialog extends React.Component {
    close() {
        if (this.props.waiting === true)
            return;
        this.props.onClose();
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.close.bind(this)}
                   backdrop={this.props.waiting ? "static" : true}>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={this.props.waiting} bsStyle={this.props.confirmButtonStyle}
                            onClick={this.props.onConfirm}>{this.props.waiting ? "请稍等" : "确认"}</Button>
                    <Button disabled={this.props.waiting} onClick={this.close.bind(this)}>取消</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ConfirmDialog.defaultProps = {
    show: false,
    confirmButtonStyle: "success"
};

ConfirmDialog.propTypes = {
    show: PropTypes.bool,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func,
    confirmButtonStyle: PropTypes.string,
    /**
     * Render a waiting tip on the dialog, disable all the button.
     */
    waiting: PropTypes.bool
};


export default ConfirmDialog;