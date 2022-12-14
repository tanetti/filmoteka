import { onChangeLocaleClick } from '../locale';
import { onChangePageMode } from '../page-mode';
import { onNavigationClick } from '../header-actions';
import { onScrollToTopClick } from '../scroll';
import { onMovieClick, onTrailerClick } from '../modal';
import { onLibraryClick } from '../header-actions';
import { onPaginationClick } from '../pagination-actions';
import { onModalButtonClick } from '../modal-actions';
import { teamSlider } from '../team-slider';
import { openModal } from '../modal';
import { PAGINATION_ACTION_DELAY } from '../constants';

export const documentClickHandler = event => {
  event.preventDefault();

  const clickID = event.target.dataset.click;
  const target = event.target;

  if (!clickID) return;

  switch (clickID) {
    case 'page-locale': {
      onChangeLocaleClick();
      break;
    }

    case 'page-mode': {
      onChangePageMode();
      break;
    }

    case 'navigation': {
      onScrollToTopClick();
      setTimeout(
        () => onNavigationClick(target.dataset.page),
        PAGINATION_ACTION_DELAY
      );
      break;
    }

    case 'library': {
      onScrollToTopClick();
      setTimeout(
        () => onLibraryClick(target.dataset.section),
        PAGINATION_ACTION_DELAY
      );
      break;
    }

    case 'scroll-to-top': {
      onScrollToTopClick();
      break;
    }

    case 'movie': {
      onMovieClick(target);
      break;
    }

    case 'trailer': {
      onTrailerClick(target);
      break;
    }

    case 'team': {
      openModal(target, teamSlider);
      break;
    }

    case 'pagination': {
      onPaginationClick(target.dataset);
      break;
    }

    case 'watched': {
      onModalButtonClick(target);
      break;
    }

    case 'queue': {
      onModalButtonClick(target);
      break;
    }
  }
};
