import React from 'react';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router-dom';
import { shallow, render } from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import NavBar, { mapDispatchToProps } from '../index';
import LanguageProvider from '../../LanguageProvider';

import configureStore from '../../../configureStore';
import { translationMessages } from '../../../i18n';
import Banner from '../../../components/Header/banner.jpg';
import A from '../../../components/A';
import Img from '../../../components/Img';

describe('<NavBar />', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  it('should render the default language messages', () => {
    const renderedComponent = shallow(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <NavBar />
        </LanguageProvider>
      </Provider>
    );
    expect(renderedComponent.contains(<NavBar />)).toBe(true);
  });

  it('should present the default `en` english language option', () => {
    const bannerImage = <Img src={Banner} alt="react-boilerplate - Logo" />;
    const renderedComponent = render(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <MuiThemeProvider>
            <NavBar title="Blah Blah">
              <A href="https://twitter.com/mxstbr">
                {bannerImage}
              </A>
            </NavBar>
          </MuiThemeProvider>
        </LanguageProvider>
      </Provider>
    );

    expect(renderedComponent.html()).toMatch(/This is NavBar container !/i);

    // expect(renderedComponent.find('h13')).not.toBeDefined();

    // expect(renderedComponent.contains(<option value="en">en</option>)).toBe(true);
    // expect(renderedComponent.containsAnyMatchingElements([<Provider store={store} />])).toEqual(true);
    // expect(renderedComponent.contains(<img alt="react-boilerplate - Logo" />)).toBe(true);
  });

  describe('mapDispatchToProps', () => {
    describe('onLocaleToggle', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result).toEqual({ dispatch });
      });
    });
  });
});
