import { pageState } from '../state';
import { setGlobalLocale } from './';
import { moviesFetcher } from '../api';

export const onChangeLocaleClick = () => {
  pageState.locale = pageState.locale === 'en' ? 'ua' : 'en';

  moviesFetcher.reRenderMovies();
  setGlobalLocale(pageState.locale);
};