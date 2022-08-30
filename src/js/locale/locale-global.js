import {
  setLocaleHTMLLang,
  setHeaderLocaleFields,
  setMainLocaleFields,
  setFooterLocaleFields,
} from './';

export const setGlobalLocale = (locale, prevLocale) => {
  if (
    prevLocale === locale ||
    (!prevLocale && document.body.classList.contains('is-loaded'))
  )
    return;

  setLocaleHTMLLang(locale);

  setHeaderLocaleFields(locale);
  setMainLocaleFields(locale);
  setFooterLocaleFields(locale);
};
