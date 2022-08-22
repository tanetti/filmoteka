import { moviesFetcher } from '../api';
import { onEscPress } from './';

export const searchMovies = ({ target }) => {
  if (!target.value) {
    moviesFetcher.query = null;
    moviesFetcher.renderTrending();

    window.removeEventListener('keydown', onEscPress);

    return;
  }

  moviesFetcher.query = target.value;
  moviesFetcher.renderSearched();

  window.addEventListener('keydown', onEscPress);
};
