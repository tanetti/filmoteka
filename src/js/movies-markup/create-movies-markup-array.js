import { choseImageSize, createGenresDescription, truncateTitle } from '.';
import * as noImage from '../../images/no-image.png';

export const createMoviesMarkupArray = (moviesData, pageState, localeDB) =>
  moviesData.map(movieData => {
    const {
      id,
      title,
      poster_path,
      release_date,
      vote_average,
      genre_ids,
      video,
    } = movieData;

    return `
    <li class="movie">
        <button class="movie__container" type="button" aria-label="${title}" aria-expanded="false" aria-controls="movie-modal" data-movie="${id}" data-click="movie">
          <span class="movie__image-container">  
            <img class="movie__image is-loading" src="${
              poster_path ? choseImageSize(poster_path) : noImage
            }" width="400" height="600" alt="${title}" loading="lazy" data-movie_image />
          </span>
          <span class="movie__data">
            <span class="movie__title">${truncateTitle(title)}</span>
            <span class="movie__description">
              <span>${createGenresDescription(
                genre_ids,
                pageState,
                localeDB
              )}</span>
              ${
                release_date &&
                `<span class="movie__year">${release_date.substring(
                  0,
                  4
                )}</span>`
              }
            </span>
          </span>
          <span class="movie__rating">
            ${vote_average.toFixed(1)}
          </span>
          <span class="movie__trailer" aria-expanded="false" aria-controls="trailer-modal" data-movie="${id}" data-click="trailer">
            Trailer
          </span>
        </button>
    </li>`;
  });
