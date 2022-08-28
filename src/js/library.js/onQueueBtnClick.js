import { checkMovieInLocalStorage } from './find-movie-in-library';
import { addMovieToLocalStorage } from './add-to-library-list';
import { removeMovieFromLocalStorage } from './remove-from-library-list';

export default function onQueueBtnClick(movieId) {
  if (checkMovieInLocalStorage(movieId, 'queue')) {
    return;
  } else if (checkMovieInLocalStorage(movieId, 'watched')) {
    addMovieToLocalStorage(movieId, 'queue');
    removeMovieFromLocalStorage(movieId, 'watched');
  } else {
    addMovieToLocalStorage(movieId, 'queue');
  }
}
