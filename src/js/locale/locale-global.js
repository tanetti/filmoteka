import { setHeaderLocaleFields, setFooterLocaleFields } from './';

export const setGlobalLocale = locale => {
  setHeaderLocaleFields(locale);
  setFooterLocaleFields(locale);
};
