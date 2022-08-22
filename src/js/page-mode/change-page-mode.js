import { pageState } from '../state';
import { setPageMode } from './set-page-mode';

export const changePageMode = () => {
  pageState.mode = pageState.mode === 'light' ? 'dark' : 'light';

  setPageMode(pageState.mode);
};
