import { sad, drama, ok } from './';

export const errorRendering = (error, localeDB, pageState) => {
  let currentIcon = sad;
  let messageClass = 'error';
  let localeField = null;
  let messageText = null;

  if (error === 'general') {
    currentIcon = drama;
    localeField = 'errorGeneral';
    messageText = localeDB[pageState.locale].main.errorGeneral;
  }

  if (error === 'no-results' && pageState.currentPage != 'library') {
    localeField = 'errorNotFound';
    messageText = localeDB[pageState.locale].main.errorNotFound;
  }

  if (error === 'no-results' && pageState.currentPage === 'library') {
    currentIcon = ok;
    messageClass = 'notify';

    if (pageState.currentLibrarySection === 'watched') {
      localeField = 'notifyWatchedEmpty';
      messageText = localeDB[pageState.locale].main.notifyWatchedEmpty;
    }

    if (pageState.currentLibrarySection === 'queue') {
      localeField = 'notifyQueueEmpty';
      messageText = localeDB[pageState.locale].main.notifyQueueEmpty;
    }
  }

  return `${currentIcon}<div class="error__text error__text--${messageClass}" data-locale_field="${localeField}">${messageText}</div>`;
};
