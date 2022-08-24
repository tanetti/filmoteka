import { pageState } from '../state';
import { setPageMode } from './';

export const onSystemModeChange = ({ matches }) => {
  pageState.mode = matches ? 'dark' : 'light';
  setPageMode(pageState.mode);
};
