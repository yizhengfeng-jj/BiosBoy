import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import CoreLayout from '../layout';

const AppContainer = (store, history) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <CoreLayout/>
      </ConnectedRouter>
    </Provider>
  );
};

AppContainer.propTypes = {
    store: PropTypes.object,
    history: PropTypes.object
}
export default AppContainer;
