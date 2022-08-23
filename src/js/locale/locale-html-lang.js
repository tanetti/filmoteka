import { localeDB } from './';

export const setLocaleHTMLLang = locale => {
  document.documentElement.setAttribute('lang', localeDB[locale].html);
};
