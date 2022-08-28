import { moviesFetcher } from '../api';

export default function addMovieToLocalStorage(filmId, storageKey) {
  let savedMovieList = [];
  const addedMovie = moviesFetcher
    .queryData()
    .find(movie => movie.id === filmId);

  if (localStorage.getItem(storageKey)) {
    try {
      const parsedList = JSON.parse(localStorage.getItem(storageKey));
      savedMovieList = [...parsedList.unshift(addedMovie)];
    } catch (error) {
      console.error('Get state error: ', error.message);
    }
  } else {
    savedMovieList.push(addedMovie);
  }

  localStorage.setItem(storageKey, JSON.stringify(savedMovieList));
}
