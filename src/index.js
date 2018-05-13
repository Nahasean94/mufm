import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'


const store = createStore(rootReducer, compose(applyMiddleware(thunk)))


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'))
registerServiceWorker();