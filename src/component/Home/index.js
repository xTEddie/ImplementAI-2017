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
                var count; 
                var max_size = 10;
                var size = response.data.length;
                if (max_size > size) 
                    max_size = size 
                for(count = 0; count < max_size; count++){
                    console.log(response.data[count].message);
                }
            }
        });
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
                        this.setState({id: id, token: accessToken});
                        this.getFeed()
                        // Send it to the MICROSOFT ML
                        console.log(url)
                    }} 
                />   
                <button
                    onClick={() => this.getFriends()}
                >
                    Get Friends
                </button>
            </div>
        )
    }
}

export default Home;