import { pageState } from '../state';
import { setGlobalLocale } from './';

export const changeLocale = () => {
  pageState.locale = pageState.locale === 'en' ? 'ua' : 'en';

  setGlobalLocale(pageState.locale);
};
