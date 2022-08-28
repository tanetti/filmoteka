import { choseImageSize, createGenresDescription } from '../movies-markup';
import { localeDB } from '../locale';
import { pageState } from '../state';
import * as noImage from '../../images/no-image.png';

export const createMovieModalMarkup = ({
  id,
  poster_path,
  title,
  vote_average,
  vote_count,
  popularity,
  original_title,
  genre_ids,
  overview,
}) =>
  `<div class="movie-modal__image-container">
    <img class="movie-modal__image" src="${
      poster_path ? choseImageSize(poster_path) : noImage
    }" alt="${title}" />
  </div>
  <div class="movie-modal__info-container">
    <h3 class="movie-modal__title"> ${title}</h3>
    <table class="movie-modal__description description">
      <tbody>
        <tr class="description__line">
          <th class="description__head">${
            localeDB[pageState.locale].movieModal.votes
          }</th>
          <td class="description__data">
            <span class="description__vote">${vote_average.toFixed(
              1
            )}</span>/ ${vote_count}
          </td>
        </tr>
        <tr class="description__line">
          <th class="description__head">${
            localeDB[pageState.locale].movieModal.popularity
          }</th>
          <td class="description__data">${popularity.toFixed(1)}</td>
        </tr>
        <tr class="description__line">
          <th class="description__head">${
            localeDB[pageState.locale].movieModal.originalTitle
          }</th>
          <td class="description__data">${original_title}</td>
        </tr>
        <tr class="description__line">
          <th class="description__head">${
            localeDB[pageState.locale].movieModal.genre
          }</th>
          <td class="description__data">${createGenresDescription(
            genre_ids
          )}</td>
        </tr>
      </tbody>
    </table>
    <p class="movie-modal__about">${
      localeDB[pageState.locale].movieModal.about
    }</p>
    <p class="movie-modal__overview">${overview}</p>
    <div class="movie-modal__button-container">
      ${
        pageState.isInWatched(id)
          ? `<button class="movie-modal__button is-active" type="button" data-movie="${id}" data-click="watched">
              <span class="movie-modal__button-text">${
                localeDB[pageState.locale].movieModal.removeWatched
              }</span>
            </button>`
          : `<button class="movie-modal__button" type="button" data-movie="${id}" data-click="watched">
              <span class="movie-modal__button-text">${
                localeDB[pageState.locale].movieModal.addWatched
              }</span>
            </button>`
      }
      ${
        pageState.isInQueue(id)
          ? `<button class="movie-modal__button is-active" type="button" data-movie="${id}" data-click="queue">
              <span class="movie-modal__button-text">${
                localeDB[pageState.locale].movieModal.removeQueue
              }</span>
            </button>`
          : `<button class="movie-modal__button" type="button" data-movie="${id}" data-click="queue">
              <span class="movie-modal__button-text">${
                localeDB[pageState.locale].movieModal.addQueue
              }</span>
            </button>`
      }
    </div>
  </div>`;
