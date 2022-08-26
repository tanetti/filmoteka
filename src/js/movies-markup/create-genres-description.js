export const createGenresDescription = (genre_ids, pageState, localeDB) => {
  const localeGenres =
    pageState[`genres${pageState.locale === 'en' ? 'EN' : 'UA'}`];

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
    return localeDB[pageState.locale].movie.noGenre;

  if (currGenresArray.length < 4) return currGenresArray.join(', ');

  currGenresArray.length = 2;
  currGenresArray.push(localeDB[pageState.locale].movie.others);

  return currGenresArray.join(', ');
};
