import { pageState } from '../state';
import { setPageMode } from './';

export const onChangePageMode = () => {
  pageState.mode = pageState.mode === 'light' ? 'dark' : 'light';

  setPageMode(pageState.mode);
};
