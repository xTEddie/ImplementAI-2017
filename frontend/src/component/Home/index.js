import axios from 'axios';
import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';



class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            id: '',
            scope: 'user_friends, user_photos, user_posts'
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
 

    }

    setCharAt(str, index, chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }

    render() {

        return (
            <div className="container"> 
                <h1>                     
                    <span style={{color: 'blue'}}> <i className="fa fa-stethoscope" aria-hidden="true"></i> </span>
                    {" "}
                    Depression Detector
                    {" "}
                    <span style={{color: 'red'}}> <i className="fa fa-heartbeat" aria-hidden="true"></i> </span>
                </h1>
                
                <FacebookLogin
                    version='2.10'
                    appId="197518687455786"
                    autoLoad={true}        
                    fields="name,email,picture"                                
                    scope={this.state.scope}
                    callback={(response) => {                                                
                        let {id, accessToken, picture: {data: {url}}} = response;                        
                        this.setState({id: id, token: accessToken, url: url});
                        this.getFeed();
                    }} 
                />   
                <button
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
                        console.log(this.state.message);
                        
                    }}
                >
                    Am I Depressed?  
                </button>
            </div>
        )
    }
}

export default Home;