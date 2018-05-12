/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { AuthGlobals } from 'redux-auth/bootstrap-theme';
// import { AuthGlobals } from "redux-auth/material-ui-theme";
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';

import LoginPage from 'containers/LoginPage/Loadable';

export default function App() {
  return (
    <div>
      <AuthGlobals
        signOutSuccessEnabled={false}
        emailSignInSuccessEnabled={false}
        emailSignUpSuccessEnabled={false}
      />
      <Helmet
        titleTemplate="%s - React.js Boilerplate"
        defaultTitle="React.js Boilerplate"
      >
        <meta name="description" content="A React.js Boilerplate application" />
      </Helmet>
      <Header />
      <div className="container">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/features" component={FeaturePage} />

          <Route path="/login" component={LoginPage} />

          <Route path="" component={NotFoundPage} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}
