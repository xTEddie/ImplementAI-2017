import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route} from 'react-router-dom';
import Home from './component/Home';


ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={Home}/>                                
        </div>
    </Router>,
    document.getElementById('root')
)

