import {
  setHeaderLocaleFields,
  setMainLocaleFields,
  setFooterLocaleFields,
} from './';

export const setGlobalLocale = locale => {
  setHeaderLocaleFields(locale);
  setMainLocaleFields(locale);
  setFooterLocaleFields(locale);
};
