import axios from 'axios';
import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import settings from '../../config/settings';
import './Home.scss';
import $ from 'jquery';

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
            progress: 0
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

    renderProgressBar() {

        let bar = new ProgressBar.Circle('#circle', {
            color: '#aaa',
            // This has to be the same size as the maximum width to
            // prevent clipping
            strokeWidth: 4,
            trailWidth: 1,
            easing: 'easeInOut',
            duration: 1000,
            text: {
                autoStyleContainer: false
            },
            from: { color: '#70A249', width: 1 },
            to: { color: '#f00', width: 3 },
            // Set default step function for all animate calls
            step: function(state, circle) {
                circle.path.setAttribute('stroke', state.color);
                circle.path.setAttribute('stroke-width', state.width);

                let value = Math.round(circle.value() * 100);
                if (value === 0) {
                    circle.setText('');
                } else {
                    circle.setText(value);
                }
            }
        });
        bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
        bar.text.style.fontSize = '2rem';

        bar.animate(this.state.progress / 100);  // Number from 0.0 to 1.0
    }

    componentDidMount() {
        if(this.state.progress > 0) {
            this.renderProgressBar();
        }
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
                            this.setState({progress: parseInt(response.data.result)})

                            $('#circle').remove();
                            $(".container").append('<div id="circle"></div>');
                            this.renderProgressBar();                            
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }}
            >
                Am I Depressed?  
            </button>
        ); 

        let logoutButton = (
           <button
                className="btn btn-lg btn-custom"
                onClick={() => {                                            
                    window.FB.logout((response) => {
                        this.setState({loggedIn: false});
                    });
                }}
            >
                Logout
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
                
                {this.state.loggedIn? logoutButton: loginButton}
                <p></p>
                {this.state.loggedIn? checkDepressionButton: ''}


                <div id="circle"></div>
            </div>
        )
    }
}

export default Home;