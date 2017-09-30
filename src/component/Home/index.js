import axios from 'axios';
import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';



class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            id: '',
            scope: 'user_friends, user_photos'
        }
    }

    getFriends() {
        // console.log(this.state);
        let url = `https://graph.facebook.com/me/friends?access_token=${this.state.token}&fields=name,id,picture,friends`;
        console.log(url);
        window.FB.api(`/${this.state.id}/permissions`, (response) => {
            console.log(response.data);
        });

        // window.FB.api(`/${this.state.id}/friends`, (response) => {
        //     console.log(response);
        // });

        window.FB.api(`/${this.state.id}/photos`, (response) => {
            console.log(response.data);

            for(let photo of response.data) {
                // console.log(photo);

                window.FB.api(`/${photo.id}`, (response) => {
                    console.log(response);
                });                
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
                        let {id, accessToken} = response;                        
                        this.setState({id: id, token: accessToken});
                        console.log(response);
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