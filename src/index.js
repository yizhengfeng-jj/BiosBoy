import React from 'react';
import ReactDom from 'react-dom';
import RedBox from 'redbox-react';

import store from './controller/store';
import history from './controller/history';
import AppContainer from './containers/AppContainer';

const ENTRY_POINT = document.querySelector('#react-app-root');

const render = () => {
    ReactDom.render(<AppContainer store={store} history={history}/>, ENTRY_POINT);
}

const renderError = error => {
    ReactDom.render(<RedBox error={error}/>, ENTRY_POINT)
}

// pwa相关
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./serviceWorker.js')
      .then(registration => {
        console.log('Excellent, registered with scope: ', registration.scope);
      })
      .catch(e => console.error('ERROR IN SERVICE WORKERS: ', e));
   }

   
// 热跟新处理
if (__DEV__) {
    const devRender = () => {
        if (module.hot) {
            module.hot.accept('./containers/AppContainer', () => render())
        }

        render();
    }

    try {
        devRender()
    }catch (error) {
       console.log(error);
       renderError(error)
    }
}else {
    render();
}