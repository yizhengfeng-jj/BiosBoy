import React from 'react';
import { Route, withRouter } from 'react-router-dom';

import { Header, Footer } from '../components';

import { Body } from '../containers/Wrappers';
import styles from '../style/index.scss';

const CoreLayout = () => {
  return (
    <div className={styles.apprapper}>
      <Header />
      <Route exact path="/" component={Body} />
      <Footer />
    </div>
  );
};

export default withRouter(CoreLayout);
