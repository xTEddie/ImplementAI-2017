import React, {Component} from 'react';
import './Footer.scss';


class Footer extends Component {

    render() {

        return(
            <div id="footer">
                Coded with 
                {" "}
                <span style={{'color': 'red'}}>
                    <i className="fa fa-heart" aria-hidden="true"/> 
                </span>
                {" "}
                @ Implement
                <span style={{'color': 'red'}}>
                    AI
                </span>
            </div>
        )
    }
}

export default Footer;