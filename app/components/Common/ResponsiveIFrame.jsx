/**
 Date: 3/7/18
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description:
 **/

import React from 'react';
import PropTypes from 'prop-types';

class ResponsiveIFrame extends React.Component {
    static resizeIFrame() {
        let section = $("section");
        let totalHeight = $("body").innerHeight();
        let footerHeight = $("footer").height();
        let headerHeight = $("header").outerHeight();
        section.outerHeight(totalHeight - footerHeight - headerHeight);
    }

    componentDidMount() {
        ResponsiveIFrame.resizeIFrame();
        $(window).resize(ResponsiveIFrame.resizeIFrame);
    }


    componentWillUnmount() {
        /**
         * Change back to auto height of section to prevent other component display abnormally.
         */
        $("section").height("auto");
    }

    render() {
        return (
            <iframe id="responsive-frame" height="100%" width="100%" src={this.props.src}/>
        );
    }
}

ResponsiveIFrame.propTypes = {
    src: PropTypes.string
};

export default ResponsiveIFrame;