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

    render() {

        return (
            <div> 
                <h1> Emotion Tracker </h1>
                
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
                        {/*  ML can use this.state.message and this.stat.url*/}
                        console.log(this.state.message);

                        const emojiRegex = require('emoji-regex/es2015/index.js');
                        const emojiRegexText = require('emoji-regex/es2015/text.js');
                        let regex = emojiRegex();

                        let {messsage} = this.state.message 
                        Object.keys(message).map((key, index) => {
                            let text = message[key];
                            let match = regex.exec(text);
                            
                            if(match) {
                                console.log(match);
                                console.log(match.index);
                            }

                        });
                        
                    }}
                >
                    Am I Depressed?  
                </button>
            </div>
        )
    }
}

export default Home;