import { checkMovieInLocalStorage } from './find-movie-in-library';
import { addMovieToLocalStorage } from './add-to-library-list';
import { removeMovieFromLocalStorage } from './remove-from-library-list';

export default function onWatchedBtnClick(movieId) {
  if (checkMovieInLocalStorage(movieId, 'watched')) {
    return;
  } else if (checkMovieInLocalStorage(movieId, 'queue')) {
    addMovieToLocalStorage(movieId, 'watched');
    removeMovieFromLocalStorage(movieId, 'queue');
  } else {
    addMovieToLocalStorage(movieId, 'watched');
  }
}
