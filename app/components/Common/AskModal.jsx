/**
 Date: 3/8/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import {Button, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';

/**
 * A modal that will ask the user to confirm or cancel. You can either set message or children, to get things render in
 * the body of the modal.
 */
class AskModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {show: props.show};
    }

    close() {
        typeof this.props.onCancel === 'function' ? this.props.onCancel() : false;
        this.setState({show: false});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({show: nextProps.show});
    }

    confirm() {
        let ret = typeof this.props.onConfirm === 'function' ? this.props.onConfirm() : true;
        if (ret === true) {
            this.setState({show: false});
        } else if (ret && typeof ret.then === 'function') {
            ret.then(() => {
                this.setState({show: false})
            });
        }
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.close.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>确认</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>{this.props.message}</strong>
                    {this.props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle={this.props.confirmBsStyle || "primary"}
                            onClick={this.confirm.bind(this)}>是</Button>
                    <Button bsStyle={this.props.cancelBsStyle || "default"} onClick={this.close.bind(this)}>否</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

AskModal.propTypes = {
    /**
     * A string message to ask the user
     */
    message: PropTypes.string,
    /**
     * When user clicked yes, this will be called. You can return true, to immediately close this modal, or a promise,
     * when waiting the promise, the button cannot be clicked, and can not quit the modal.When promise fulfilled,
     * the modal will be closed.
     * @type {function()}
     */
    onConfirm: PropTypes.func,
    /**
     * One of success, danger, primary, info, warning, default.
     */
    confirmBsStyle: PropTypes.string,
    /**
     * One of success, danger, primary, info, warning, default.
     */
    cancelBsStyle: PropTypes.string,
    /**
     * When user clicked no, this will be called. Immediately close it.
     */
    onCancel: PropTypes.func,
    /**
     * set this to true to display the modal
     */
    show: PropTypes.bool,
};

export default AskModal;