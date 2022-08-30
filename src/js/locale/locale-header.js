import { rootRefs } from '../root-refs';
import { localeDB } from './';
import { LOCALE_TRANSITION_TIME } from '../constants';

const refs = {
  headerLocaleFields: rootRefs.headerContainer.querySelectorAll(
    '[data-locale_field]'
  ),
};

export const setHeaderLocaleFields = locale => {
  for (const localeField of refs.headerLocaleFields) {
    if (localeField.placeholder) {
      if (document.body.classList.contains('is-loaded')) {
        localeField.classList.add(
          'placeholder-opacity-transition',
          'placeholder-opacity'
        );
        setTimeout(() => {
          localeField.placeholder =
            localeDB[locale].header[localeField.dataset.locale_field];

          localeField.classList.remove('placeholder-opacity');
        }, LOCALE_TRANSITION_TIME);

        continue;
      }

      localeField.placeholder =
        localeDB[locale].header[localeField.dataset.locale_field];
    }

    if (document.body.classList.contains('is-loaded')) {
      localeField.classList.add('opacity-transition', 'opacity');
      setTimeout(() => {
        localeField.textContent =
          localeDB[locale].header[localeField.dataset.locale_field];

        localeField.classList.remove('opacity');
      }, LOCALE_TRANSITION_TIME);

      continue;
    }

    localeField.textContent =
      localeDB[locale].header[localeField.dataset.locale_field];
  }
};
