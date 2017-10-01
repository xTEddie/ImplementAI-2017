import axios from 'axios';
import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import {Circle} from 'react-progressbar.js';
import settings from '../../config/settings';
import './Home.scss';
import $ from 'jquery';
// const circleProgress = require('jquery-circle-progress');
const ProgressBar = require('progressbar.js');



class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            id: '',
            scope: 'user_friends, user_photos, user_posts',
            textButton: 'Sign In',
            loggedIn: false,
            progress: 50
        }
    }

    getFeed() {
        window.FB.api("/me/posts",
            (response) => {
                if (response && !response.error) {                    
                    let size = response.data.length;
                    let max_size = max_size > size? size: 10;
                    let message = {};      
                                  
                    for(let count = 0; count < max_size; count++){
                        // Remove hashtags
                        if ("message" in response.data[count]) {
                            var regexp = new RegExp('#([^\\s]*)','g');
                            message[count] = (response.data[count].message).replace(regexp, '');
                        }
                    }
                
                    this.setState({message: message});
                }
            }
        );
    }

    componentDidMount() {
        // $('#circle').circleProgress({
        //     value: 0.75,
        //     size: 200,
        //     animationStartValue: 0,
        //     fill: {
        //     gradient: ["red", "orange"]
        //     }
        // });

        
        var bar = new ProgressBar.Line('#circle', {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 1400,
            color: '#FFEA82',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: {width: '100%', height: '100%'},
            text: {
                style: {
                    // Text color.
                    // Default: same as stroke color (options.color)
                    color: '#999',
                    position: 'absolute',
                    right: '0',
                    top: '30px',
                    padding: 0,
                    margin: 0,
                    transform: null
                },
                autoStyleContainer: false
            },
            from: {color: '#FFEA82'},
            to: {color: '#ED6A5A'},
            step: (state, bar) => {
                bar.setText(Math.round(bar.value() * 100) + ' %');
            }
        });
        bar.animate(1);
    }

    render() {

        let loginButton = (
            <FacebookLogin
                textButton={this.state.textButton}
                cssClass='login-facebook'
                version='2.10'
                appId="197518687455786"
                autoLoad={true}        
                fields="name, hometown, age_range, gender, email,picture"                                
                scope={this.state.scope}
                callback={(response) => {                              
                    let {hometown, age_range, name, gender, id, accessToken, picture: {data: {url}}} = response; 
                    if (typeof hometown == "undefined")
                        hometown = ""; 
                    if (typeof age_range == "undefined")
                        age_range = ""; 
                    if (typeof gender == "undefined")
                        gender = ""; 
                    this.setState({age_range: age_range, name: name, gender: gender, hometown: hometown, url: url, loggedIn: true});
                    this.getFeed();
                }} 
            />
        );

        let checkDepressionButton = (
            <button
                className="btn btn-lg btn-custom"
                onClick={() => {                                            

                    const emojiRegex = require('emoji-regex/es2015/index.js');
                    const emojiRegexText = require('emoji-regex/es2015/text.js');
                    let regex = emojiRegex();

                    let {message} = this.state;
                    Object.keys(message).map((key, index) => {

                        let match = regex.exec(message[key]);
                        while(match){
                            // console.log(match);                                
                            // Filter out emoji                    
                            message[key] = message[key].substr(0, match.index) + message[key].substring(match.index + match.input.length);                        
                            match = regex.exec(message[key]);

                            this.setState({message: message});    
                        }
                                                                    
                    });

                    let data = {
                        message: this.state.message,
                        img: this.state.url,
                        age_range: this.state.age_range,
                        hometown: this.state.hometown,
                        gender: this.state.gender,
                        name: this.state.name
                    };

                    axios.post(`${settings.API_ROOT}/ai`, data)
                        .then((response) => {
                            console.log(response);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }}
            >
                Am I Depressed?  
            </button>
        ); 

        return (
            <div className="container">
                <div> 
                    <h1>                     
                        <span style={{color: 'grey'}}> <i className="fa fa-stethoscope" aria-hidden="true"></i> </span>
                        {" "}
                        <span className='title'> Depression Detector </span>
                        {" "}
                        <span style={{color: 'red'}} className=''> <i className="fa fa-heartbeat" aria-hidden="true"></i> </span>
                    </h1>
                </div>
                
                {this.state.loggedIn? '': loginButton}
                {this.state.loggedIn? checkDepressionButton: ''}

                <div id="circle"></div>
            </div>
        )
    }
}

export default Home;