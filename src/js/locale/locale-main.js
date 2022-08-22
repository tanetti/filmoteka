import { rootRefs } from '../root-refs';
import { localeDB } from './';
import { LOCALE_TRANSITION_TIME } from '../constants';

const refs = {
  mainLocaleFields: rootRefs.mainContainer.querySelectorAll(
    '[data-locale_field]'
  ),
};

export const setMainLocaleFields = locale => {
  for (const localeField of refs.mainLocaleFields) {
    if (document.body.classList.contains('is-loaded')) {
      localeField.classList.add('opacity-transition', 'opacity');
      setTimeout(() => {
        localeField.textContent =
          localeDB[locale].main[localeField.dataset.locale_field];

        localeField.classList.remove('opacity');
      }, LOCALE_TRANSITION_TIME);

      continue;
    }

    localeField.textContent =
      localeDB[locale].main[localeField.dataset.locale_field];
  }
};
