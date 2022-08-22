import { pageState } from './state';
import { rootRefs } from './root-refs';
import { setGlobalLocale, changeLocale } from './locale';
import { setPageMode, changePageMode } from './page-mode';

setPageMode(pageState.mode);
setGlobalLocale(pageState.locale);

rootRefs.localeSwitch.addEventListener('click', changeLocale);
rootRefs.modeSwitch.addEventListener('change', changePageMode);
