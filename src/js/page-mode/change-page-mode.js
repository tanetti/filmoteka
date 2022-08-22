import { pageState } from '../state';
import { setPageMode } from './';

export const changePageMode = () => {
  pageState.mode = pageState.mode === 'light' ? 'dark' : 'light';

  setPageMode(pageState.mode);
};
