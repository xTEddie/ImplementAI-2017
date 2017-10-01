import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route} from 'react-router-dom';
import Home from './component/Home';
import Footer from './component/Footer';


ReactDOM.render(
    <Router>
        <div>
            <Route exact path="/" component={Home}/>                                
            <Route path="/" component={Footer}/>  
        </div>
    </Router>,
    document.getElementById('root')
)

