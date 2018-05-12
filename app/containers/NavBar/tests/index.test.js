import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router-dom';
import { shallow, render } from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import NavBar, { mapDispatchToProps } from '../index';
import LanguageProvider from '../../LanguageProvider';

import configureStore from '../../../configureStore';
import { translationMessages } from '../../../i18n';
import Banner from '../../../components/Header/banner.jpg';
import A from '../../../components/A';
import Img from '../../../components/Img';

const history = createHistory();

describe('<NavBar />', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ auth: { user: { isSignedIn: false } } }, browserHistory);
  });

  const bannerImage = <Img src={Banner} alt="react-boilerplate - Logo" />;

  function Container({ children }) {
    return (<Provider store={store}>
      <ConnectedRouter history={history}>
        <LanguageProvider messages={translationMessages}>
          <MuiThemeProvider>
            {children}
          </MuiThemeProvider>
        </LanguageProvider>
      </ConnectedRouter>
    </Provider>);
  }

  Container.propTypes = {
    children: PropTypes.any,
  };

  describe('Signed In', () => {
    beforeEach(() => {
      store = configureStore({ auth: { user: { isSignedIn: true } } }, browserHistory);
    });

    it('should present the default `en` english language option', () => {
      const renderedComponent = render(
        <Container>
          <NavBar>
            <A href="https://twitter.com/mxstbr">
              {bannerImage}
            </A>
          </NavBar>
        </Container>
      );

      expect(renderedComponent.html()).toMatch(/Sign Out Duder/i);
      expect(renderedComponent.html()).not.toMatch(/Login/i);
    });
  });

  describe('Not Signed In', () => {
    it('should present the default `en` english language option', () => {
      const renderedComponent = render(
        <Container>
          <NavBar title="Blah Blah">
            <A href="https://twitter.com/mxstbr">
              {bannerImage}
            </A>
          </NavBar>
        </Container>
      );

      expect(renderedComponent.html()).toMatch(/This is NavBar container !/i);
      expect(renderedComponent.html()).not.toMatch(/Sign Out Duder/i);
    });
  });

  it('should render the default language messages', () => {
    const renderedComponent = shallow(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LanguageProvider messages={translationMessages}>
            <NavBar />
          </LanguageProvider>
        </ConnectedRouter>
      </Provider>
    );
    expect(renderedComponent.contains(<NavBar />)).toBe(true);
  });

  describe('mapDispatchToProps', () => {
    describe('onSignoutClicked', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect('onSignoutClicked' in result).toBe(true);
        // expect(result).toEqual({ dispatch });
      });

      it('should dispatch a signOut action', () => {
        const dispatch = jest.fn();
        const preventDefault = jest.fn();
        const onSignoutClicked = mapDispatchToProps(dispatch).onSignoutClicked;
        onSignoutClicked();
        expect(dispatch).toHaveBeenCalled();
        expect(preventDefault).not.toHaveBeenCalled();
      });

      it('should call preventDefault if present', () => {
        const dispatch = jest.fn();
        const preventDefault = jest.fn();
        const onSignoutClicked = mapDispatchToProps(dispatch).onSignoutClicked;
        onSignoutClicked({ preventDefault });
        expect(preventDefault).toHaveBeenCalled();
      });
    });
  });
});
