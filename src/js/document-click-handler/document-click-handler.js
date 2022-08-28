import { onChangeLocaleClick } from '../locale';
import { onChangePageMode } from '../page-mode';
import { onScrollToTopClick } from '../scroll';
import { onMovieClick, onTrailerClick } from '../modal';
import { onPaginationClick } from '../pagination-actions';
import { onModalButtonClick } from '../library-actions';

export const documentClickHandler = event => {
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
