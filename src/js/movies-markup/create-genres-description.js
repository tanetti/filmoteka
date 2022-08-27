import { pageState } from '../state';
import { localeDB } from '../locale';

export const createGenresDescription = (
  genre_ids,
  recievedPageState = pageState,
  recievedLocaleDB = localeDB
) => {
  const localeGenres =
    recievedPageState[
      `genres${recievedPageState.locale === 'en' ? 'EN' : 'UA'}`
    ];

  const currGenresArray = genre_ids.map(genreID => {
    let currGenre = null;

    for (const genre of localeGenres) {
      if (genre.id === genreID) {
        currGenre = genre.name;

        break;
      }
    }

    return currGenre;
  });

  if (currGenresArray.length === 0)
    return recievedLocaleDB[recievedPageState.locale].movie.noGenre;

  if (currGenresArray.length < 4) return currGenresArray.join(', ');

  currGenresArray.length = 2;
  currGenresArray.push(recievedLocaleDB[recievedPageState.locale].movie.others);

  return currGenresArray.join(', ');
};
