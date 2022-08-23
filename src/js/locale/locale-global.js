import {
  setLocaleHTMLLang,
  setHeaderLocaleFields,
  setMainLocaleFields,
  setFooterLocaleFields,
} from './';

export const setGlobalLocale = locale => {
  setLocaleHTMLLang(locale);

  setHeaderLocaleFields(locale);
  setMainLocaleFields(locale);
  setFooterLocaleFields(locale);
};
