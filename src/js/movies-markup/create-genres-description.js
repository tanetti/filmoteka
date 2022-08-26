import { localeDB } from '../locale';
import { pageState } from '../state';

export const createGenresDescription = (genre_ids, savedGenres) => {
  const currGenresArray = genre_ids.map(genreID => {
    let currGenre = null;

    for (const savedGenre of savedGenres) {
      if (savedGenre.id === genreID) {
        currGenre = savedGenre.name;

        break;
      }
    }

    return currGenre;
  });

  if (currGenresArray.length === 0)
    return localeDB[pageState.locale].movie.noGenre;

  if (currGenresArray.length < 4) return currGenresArray.join(', ');

  currGenresArray.length = 2;
  currGenresArray.push(localeDB[pageState.locale].movie.others);

  return currGenresArray.join(', ');
};
