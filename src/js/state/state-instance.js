import { State } from './state';
import { STATE_LOCAL_STORAGE_KEY } from '../constants';

export const pageState = new State();

const options = {
  localStorageKey: STATE_LOCAL_STORAGE_KEY,
};

pageState.init(options);
