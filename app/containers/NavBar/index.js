/**
 *
 * NavBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import AppBar from 'material-ui/AppBar';
import { FormattedMessage } from 'react-intl';


import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectNavBar from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export class NavBar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <AppBar title={<FormattedMessage {...messages.header} />}>

      </AppBar>
    );
  }
}

NavBar.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = createStructuredSelector({
  navbar: makeSelectNavBar(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'navBar', reducer });
const withSaga = injectSaga({ key: 'navBar', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(NavBar);
