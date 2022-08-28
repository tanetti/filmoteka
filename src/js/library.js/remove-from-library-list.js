export default function removeMovieFromLocalStorage(filmId, storageKey) {
  let savedMovieList = [];
  try {
    const parsedList = JSON.parse(localStorage.getItem(storageKey));
    const removedMovie = parsedList.find(movie => movie.id === filmId);
    const indexOfRemoveItem = parsedList.indexOf(removedMovie);
    savedMovieList = [...parsedList.splice(indexOfRemoveItem, 1)];
  } catch (error) {
    console.error('Get state error: ', error.message);
  }

  localStorage.setItem(storageKey, JSON.stringify(savedMovieList));
}
