import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { pageState } from './state';
import { onPageLoad } from './on-load';
import { rootRefs } from './root-refs';
import { setGlobalLocale, onChangeLocaleClick } from './locale';
import { setPageMode, onChangePageMode, onSystemModeChange } from './page-mode';
import { onSearchMoviesInputChange } from './search';
import { onWindowScroll, onScrollToTopClick } from './scroll';
import { onPaginationClick } from './pagination-actions';
import { onWindowResize } from './resize';
import {
  SEARCH_DEBOUNCE_DELAY,
  SCROLL_THROTTLE_DELAY,
  RESIZE_THROTTLE_DELAY,
} from './constants';
import { onOpenModal } from './footerJS/footer';

setPageMode(pageState.mode);
setGlobalLocale(pageState.locale);

onPageLoad();

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', onSystemModeChange);
window.addEventListener(
  'scroll',
  throttle(onWindowScroll, SCROLL_THROTTLE_DELAY)
);
window.addEventListener(
  'resize',
  throttle(onWindowResize, RESIZE_THROTTLE_DELAY)
);
rootRefs.scrollToTopButton.addEventListener('click', onScrollToTopClick);
rootRefs.localeSwitch.addEventListener('click', onChangeLocaleClick);
rootRefs.modeSwitch.addEventListener('change', onChangePageMode);
rootRefs.moviesPagination.addEventListener('click', onPaginationClick);
rootRefs.searchField.addEventListener(
  'input',
  debounce(onSearchMoviesInputChange, SEARCH_DEBOUNCE_DELAY)
);
rootRefs.footerButton.addEventListener('click', onOpenModal);
