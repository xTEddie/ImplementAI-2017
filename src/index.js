import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route} from 'react-router-dom';

'<h1> HELLO WORLD! </h1>';

ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" render={() => (<h1> HELLO WORLD! </h1>)}/>                                
        </div>
    </Router>,
    document.getElementById('root')
)

