import axios from 'axios';
import React, {Component} from 'react';


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: 'hi'
        }
    }

    render() {

        return (
            <div> 
                <h1> HELLO WORLD </h1>
                <h2> {this.state.message} </h2>
            </div>
        )
    }
}

export default Home;