import { choseImageSize, createGenresDescription } from '.';
import * as noImage from '../../images/no-image.png';

export const createMoviesMarkupArray = (moviesData, pageState, localeDB) =>
  moviesData.map(movieData => {
    const { id, title, poster_path, release_date, vote_average, genre_ids } =
      movieData;

    return `
    <li class="movie">
        <button class="movie__container" aria-label="${title}" aria-expanded="false" data-movie="${id}">
          <div class="movie__image-container">  
            <img class="movie__image is-loading" ${
              poster_path ? choseImageSize(poster_path) : `src="${noImage}"`
            } width="400" height="600" alt="${title}" loading="lazy" data-movie_image></img>
          </div>
          <div class="movie__data">
            <p class="movie__title">${title}</p>
            <p class="movie__description">
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
            </p>
          </div>
          <div class="movie__rating">
            ${vote_average.toFixed(1)}
          </div>
        </button>
    </li>`;
  });
