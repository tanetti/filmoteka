import { rootRefs } from '../root-refs';
import { localeDB } from './locale-db';

const { headerContainer } = rootRefs;

const refs = {
  headerLocaleFields: headerContainer.querySelectorAll('[data-locale_field]'),
};

export const setHeaderLocaleFields = locale => {
  for (const localeField of Array.from(refs.headerLocaleFields)) {
    localeField.textContent =
      localeDB[locale].header[localeField.dataset.locale_field];
  }
};
