import { onChangeLocaleClick } from '../locale';
import { onChangePageMode } from '../page-mode';
import { onScrollToTopClick } from '../scroll';
import { onMovieClick, onTrailerClick } from '../modal';
import { onPaginationClick } from '../pagination-actions';
import { onModalButtonClick } from '../library-actions';

export const documentClickHandler = event => {
  const clickID = event.target.dataset.click;

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
      onMovieClick(event.target);
      break;
    }

    case 'trailer': {
      onTrailerClick(event.target);
      break;
    }

    case 'pagination': {
      onPaginationClick(event.target.dataset);
      break;
    }

    case 'watched': {
      onModalButtonClick(clickID, event.target.dataset.movie);
      break;
    }

    case 'queue': {
      onModalButtonClick(clickID, event.target.dataset.movie);
      break;
    }
  }
};
