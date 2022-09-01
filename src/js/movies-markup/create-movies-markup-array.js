import { choseImageSize, createGenresDescription, truncateTitle } from '.';
import * as noImage from '../../images/no-image.png';
import {
  TABLET_MIN_WIDTH,
  DESKTOP_MIN_WIDTH,
  MOBILE_MOVIES_WAIT_TO_LOAD,
  TABLET_MOVIES_WAIT_TO_LOAD,
  DESKTOP_MOVIES_WAIT_TO_LOAD,
} from '../constants';

const isImageShouldByLazy = idx => {
  if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
    return idx + 1 > DESKTOP_MOVIES_WAIT_TO_LOAD ? true : false;
  }

  if (window.innerWidth >= TABLET_MIN_WIDTH) {
    return idx + 1 > TABLET_MOVIES_WAIT_TO_LOAD ? true : false;
  }

  if (window.innerWidth < TABLET_MIN_WIDTH) {
    return idx + 1 > MOBILE_MOVIES_WAIT_TO_LOAD ? true : false;
  }
};

export const createMoviesMarkupArray = (moviesData, pageState, localeDB) =>
  moviesData.map(
    (
      { id, title, poster_path, release_date, vote_average, genre_ids },
      elementIdx
    ) =>
      `<li class="movie">
        <button class="movie__container" type="button" aria-label="${title}" aria-expanded="false" aria-controls="movie-modal" data-movie="${id}" data-click="movie">
          <span class="movie__image-container">  
            <img class="movie__image is-loading" src="${
              poster_path ? choseImageSize(poster_path) : noImage
            }" width="500" height="750" alt="${title}" ${
        isImageShouldByLazy(elementIdx) ? 'loading="lazy"' : ''
      } data-movie_image />
            <span class="movie__loader"><span></span><span></span><span></span><span></span></span>
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
          <span class="movie__trailer" role="button" aria-label="${
            localeDB[pageState.locale].movie.trailer
          }" aria-expanded="false" aria-controls="trailer-modal" data-movie="${id}" data-click="trailer">
            <svg class="movie__trailer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
              <path d="M230 26c-3-10-11-18-21-21-18-5-92-5-92-5S44 0 26 5C16 8 8 16 5 26 0 44 0 83 0 83s0 38 5 57c3 10 11 18 21 20 18 5 91 5 91 5s74 0 92-5c10-2 18-10 21-20 5-19 5-57 5-57s0-39-5-57" fill="red"/>
              <path d="m93 118 62-35-62-35z" />
            </svg>
          </span>
        </button>
    </li>`
  );
