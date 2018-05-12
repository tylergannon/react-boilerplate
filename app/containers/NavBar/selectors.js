import { createSelector } from 'reselect';

/**
 * Direct selector to the navBar state domain
 */
const selectNavBarDomain = (state) => state.get('navBar');

const selectAuth = (state) => state.get('auth');

/**
 * Other specific selectors
 */


/**
 * Default selector used by NavBar
 */

const makeSelectNavBar = () => createSelector(
  selectNavBarDomain,
  (substate) => substate.toJS()
);

const makeSelectAuth = () => createSelector(
  selectAuth,
  (substate) => substate.toJS()
);

const makeSelectUser = () => createSelector(
  selectAuth,
  (authState) => authState.get('user').toJS()
);

export default makeSelectNavBar;
export {
  makeSelectNavBar,
  makeSelectAuth,
  makeSelectUser,
};
