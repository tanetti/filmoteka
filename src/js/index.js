import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { pageState } from './state';
import { moviesFetcher } from './api';
import { rootRefs } from './root-refs';
import { setGlobalLocale, onChangeLocaleClick } from './locale';
import { setPageMode, onChangePageMode } from './page-mode';
import { onSearchMoviesInputChange } from './search';
import { onWindowScroll, onScrollToTopClick } from './scroll';
import { SEARCH_DEBOUNCE_DELAY, SCROLL_THROTTLE_DELAY } from './constants';

setPageMode(pageState.mode);
setGlobalLocale(pageState.locale);

moviesFetcher.renderTrending();

rootRefs.localeSwitch.addEventListener('click', onChangeLocaleClick);
rootRefs.modeSwitch.addEventListener('change', onChangePageMode);
rootRefs.searchField.addEventListener(
  'input',
  debounce(onSearchMoviesInputChange, SEARCH_DEBOUNCE_DELAY)
);
window.addEventListener(
  'scroll',
  throttle(onWindowScroll, SCROLL_THROTTLE_DELAY)
);
rootRefs.scrollToTopButton.addEventListener('click', onScrollToTopClick);
