import { rootRefs } from '../root-refs';
import { localeDB } from './';
import { LOCALE_TRANSITION_TIME } from '../constants';

const refs = {
  footerLocaleFields: rootRefs.footerContainer.querySelectorAll(
    '[data-locale_field]'
  ),
};

export const setFooterLocaleFields = locale => {
  for (const localeField of Array.from(refs.footerLocaleFields)) {
    if (document.body.classList.contains('is-loaded')) {
      localeField.classList.add('opacity-transition', 'opacity');
      setTimeout(() => {
        localeField.textContent =
          localeDB[locale].footer[localeField.dataset.locale_field];

        localeField.classList.remove('opacity');
      }, LOCALE_TRANSITION_TIME);

      continue;
    }

    localeField.textContent =
      localeDB[locale].footer[localeField.dataset.locale_field];
  }
};
