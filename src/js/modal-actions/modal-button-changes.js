import { localeDB } from '../locale';
import { pageState } from '../state';
import { LOCALE_TRANSITION_TIME } from '../constants';

export const watchedButtonChanges = (action, target) => {
  switch (action) {
    case 'add': {
      target.classList.add('is-active');
      target.firstElementChild.classList.add('is-hidden');

      setTimeout(() => {
        target.firstElementChild.textContent =
          localeDB[pageState.locale].movieModal.removeWatched;
        target.firstElementChild.classList.remove('is-hidden');
      }, LOCALE_TRANSITION_TIME);

      break;
    }

    case 'remove': {
      target.classList.remove('is-active');
      target.firstElementChild.classList.add('is-hidden');

      setTimeout(() => {
        target.firstElementChild.textContent =
          localeDB[pageState.locale].movieModal.addWatched;
        target.firstElementChild.classList.remove('is-hidden');
      }, LOCALE_TRANSITION_TIME);

      break;
    }

    case 'switch': {
      target.classList.add('is-active');
      target.nextElementSibling.classList.remove('is-active');

      target.firstElementChild.classList.add('is-hidden');
      target.nextElementSibling.firstElementChild.classList.add('is-hidden');

      setTimeout(() => {
        target.firstElementChild.textContent =
          localeDB[pageState.locale].movieModal.removeWatched;
        target.nextElementSibling.firstElementChild.textContent =
          localeDB[pageState.locale].movieModal.addQueue;

        target.firstElementChild.classList.remove('is-hidden');
        target.nextElementSibling.firstElementChild.classList.remove(
          'is-hidden'
        );
      }, LOCALE_TRANSITION_TIME);

      break;
    }
  }
};

export const queueButtonChanges = (action, target) => {
  switch (action) {
    case 'add': {
      target.classList.add('is-active');
      target.firstElementChild.classList.add('is-hidden');

      setTimeout(() => {
        target.firstElementChild.textContent =
          localeDB[pageState.locale].movieModal.removeQueue;
        target.firstElementChild.classList.remove('is-hidden');
      }, LOCALE_TRANSITION_TIME);

      break;
    }

    case 'remove': {
      target.classList.remove('is-active');
      target.firstElementChild.classList.add('is-hidden');

      setTimeout(() => {
        target.firstElementChild.textContent =
          localeDB[pageState.locale].movieModal.addQueue;
        target.firstElementChild.classList.remove('is-hidden');
      }, LOCALE_TRANSITION_TIME);

      break;
    }

    case 'switch': {
      target.classList.add('is-active');
      target.previousElementSibling.classList.remove('is-active');

      target.firstElementChild.classList.add('is-hidden');
      target.previousElementSibling.firstElementChild.classList.add(
        'is-hidden'
      );

      setTimeout(() => {
        target.firstElementChild.textContent =
          localeDB[pageState.locale].movieModal.removeQueue;
        target.previousElementSibling.firstElementChild.textContent =
          localeDB[pageState.locale].movieModal.addWatched;

        target.firstElementChild.classList.remove('is-hidden');
        target.previousElementSibling.firstElementChild.classList.remove(
          'is-hidden'
        );
      }, LOCALE_TRANSITION_TIME);

      break;
    }
  }
};
