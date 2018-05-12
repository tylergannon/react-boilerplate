import { fromJS } from 'immutable';

import signUpPageReducer from '../reducer';

import { DEFAULT_ACTION } from '../constants';
const UNKNOWN_ACTION = 'UNKNOWN_ACTION';

describe('signUpPageReducer', () => {
  describe('signUpPageReducer', () => {
    it('returns the initial state', () => {
      expect(signUpPageReducer(undefined, {})).toEqual(fromJS({}));
    });

    it('Doesn\'t change state when called with DEFAULT_ACTION', () => {
      expect(signUpPageReducer(fromJS({}), { type: DEFAULT_ACTION })).toEqual(fromJS({}));
    });

    it('Doesn\'t change state when called with UNKNOWN_ACTION', () => {
      expect(signUpPageReducer(fromJS({}), { type: UNKNOWN_ACTION })).toEqual(fromJS({}));
    });
  });
});
