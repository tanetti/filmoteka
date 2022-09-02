import { rootRefs } from '../root-refs';
import { moviesFetcher } from '../api';
import { openModal, createMovieModalMarkup } from './';
import * as noImage from '../../images/no-image.png';

export const onMovieClick = target => {
  for (const movie of moviesFetcher.queryData) {
    if (movie.id !== Number(target.dataset.movie)) continue;

    for (const modal of rootRefs.modals) {
      if (modal.dataset.modal !== target.dataset.click) continue;

      modal.querySelector('[data-container]').innerHTML =
        createMovieModalMarkup(movie);

      const image = modal.querySelector('.movie-modal__image');
      image.addEventListener('error', () => (image.src = noImage), {
        once: true,
      });
    }

    break;
  }

  openModal(target);
};
