import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router-dom';
import { shallow, render } from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import SignUpPage, { mapDispatchToProps } from '../index';
import LanguageProvider from '../../LanguageProvider';

import configureStore from '../../../configureStore';
import { translationMessages } from '../../../i18n';
// import Banner from '../../../components/Header/banner.jpg';
// import A from '../../../components/A';
// import Img from '../../../components/Img';

const history = createHistory();

describe('<SignUpPage />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the default language messages', () => {
    const renderedComponent = shallow(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LanguageProvider messages={translationMessages}>
            <SignUpPage />
          </LanguageProvider>
        </ConnectedRouter>
      </Provider>
    );
    expect(renderedComponent.contains(<SignUpPage />)).toBe(true);
  });

  it('should present the default `en` english language option', () => {
    // const bannerImage = <Img src={Banner} alt="react-boilerplate - Logo" />;
    const renderedComponent = render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LanguageProvider messages={translationMessages}>
            <MuiThemeProvider>
              <SignUpPage />
            </MuiThemeProvider>
          </LanguageProvider>
        </ConnectedRouter>
      </Provider>
    );

    expect(renderedComponent.html()).toMatch(/Sign Up With Your Email/i);
  });

  describe('mapDispatchToProps', () => {
    describe('onSignoutClicked', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result).toEqual({ dispatch });
      });
    });
  });
});
