import { fromJS } from 'immutable';

import navBarReducer from '../reducer';

import { DEFAULT_ACTION } from '../constants';
const UNKNOWN_ACTION = 'UNKNOWN_ACTION';

describe('navBarReducer', () => {
  describe('navBarReducer', () => {
    it('returns the initial state', () => {
      expect(navBarReducer(undefined, {})).toEqual(fromJS({}));
    });

    it('Doesn\'t change state when called with DEFAULT_ACTION', () => {
      expect(navBarReducer(fromJS({}), { type: DEFAULT_ACTION })).toEqual(fromJS({}));
    });

    it('Doesn\'t change state when called with UNKNOWN_ACTION', () => {
      expect(navBarReducer(fromJS({}), { type: UNKNOWN_ACTION })).toEqual(fromJS({}));
    });
  });
});
