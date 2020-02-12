import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SysethereumDApp from './SysethereumDApp';
import * as serviceWorker from './serviceWorker';
import TagManager from 'react-gtm-module';

const tagManagerArgs = {
    gtmId: 'GTM-KC8L4Z2'
}

TagManager.initialize(tagManagerArgs);

ReactDOM.render(<SysethereumDApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

