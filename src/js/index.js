import { pageState } from './state';
import { setHeaderLocaleFields } from './locale';
import { setPageMode, changePageMode } from './page-mode';

const refs = {
  localeSwitch: document.querySelector('[data-locale_switch]'),
  modeSwitch: document.querySelector('[data-mode_switch]'),
};

pageState.init();

setPageMode(pageState.mode);
setHeaderLocaleFields(pageState.locale);

const changeLocale = () => {
  pageState.locale = pageState.locale === 'en' ? 'ua' : 'en';

  setHeaderLocaleFields(pageState.locale);
};

refs.localeSwitch.addEventListener('click', changeLocale);
refs.modeSwitch.addEventListener('change', changePageMode);
