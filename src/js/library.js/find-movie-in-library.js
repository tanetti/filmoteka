export default function checkMovieInLocalStorage(filmId, storageKey) {
  if (!localStorage.getItem(storageKey)) {
    return false;
  }

  try {
    const parsedData = JSON.parse(localStorage.getItem(storageKey));
    if (parsedData.find(movie => movie.id === filmId)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
}
