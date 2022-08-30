import { moviesFetcher } from '../api';
import { pageState } from '../state';
import { watchedButtonChanges, queueButtonChanges } from '.';
import { MAIN_TRANSITION_TIME } from '../constants';

export const onModalButtonClick = async target => {
  const id = Number(target.dataset.movie);
  const type = target.dataset.click;
  let movieDataEN = null;
  let movieDataUA = null;

  target.disabled = true;
  target.offsetParent.classList.add('is-shown');

  if (pageState.locale === 'en') {
    movieDataUA = await moviesFetcher.fetchMovieByID(id, 'ua');
    if (!movieDataUA || movieDataUA === 'error') {
      target.disabled = false;
      target.offsetParent.classList.remove('is-shown');

      return;
    }

    movieDataEN = moviesFetcher.queryData.find(movie => movie.id === id);
  }
  if (pageState.locale === 'ua') {
    movieDataEN = await moviesFetcher.fetchMovieByID(id, 'en');
    if (!movieDataEN || movieDataEN === 'error') {
      target.disabled = false;
      target.offsetParent.classList.remove('is-shown');

      return;
    }

    movieDataUA = moviesFetcher.queryData.find(movie => movie.id === id);
  }

  if (type === 'watched') {
    const action = pageState.toWached(id, movieDataEN, movieDataUA);

    watchedButtonChanges(action, target);
  }
  if (type === 'queue') {
    const action = pageState.toQueue(id, movieDataEN, movieDataUA);

    queueButtonChanges(action, target);
  }

  target.disabled = false;
  setTimeout(
    () => target.offsetParent.classList.remove('is-shown'),
    MAIN_TRANSITION_TIME
  );
};
