import axios from 'axios';
import { rootRefs } from '../root-refs';
import { pageState } from '../state';
import { localeDB } from '../locale';
import { API_KEY, API_BASE_URL, MOVIES_TRANSITION_TIME } from '../constants';

axios.defaults.baseURL = API_BASE_URL;

export class Fetcher {
  constructor() {
    this._query = null;
    this._currentPage = 1;

    this._lastURL = null;
    this._lastQueryType = null;
  }

  get query() {
    return this._query;
  }

  set query(value) {
    this._query = value;
  }

  async #fetchMovies(url, urlParams) {
    rootRefs.moviesContainer.classList.remove('is-shown');

    const {
      data: { results },
    } = await axios.get(url, { params: urlParams }).catch(error => {
      if (error.response.status === 404) {
        console.log(localeDB[pageState.locale].fetcher.errors.notFound);
        return;
      }

      console.log(localeDB[pageState.locale].fetcher.errors.general);
    });

    this._lastURL = url;

    return results;
  }

  #renderMovies(moviesData) {
    rootRefs.moviesContainer.innerHTML = moviesData
      .map(
        ({
          title,
          original_title,
          poster_path,
          release_date,
          vote_average,
        }) => `
    <li class="movie">
        <button class="movie__container" aria-label="${title}" aria-expanded="false">
            <img class="movie__image" src="https://image.tmdb.org/t/p/w500${poster_path}" width="200" alt="${title}"></img>
            <div class="movie__data">
                <p>
                    ${title}
                    ${pageState.locale === 'ua' ? ` - ${original_title}` : null}
                </p>
                <p>${release_date}</p>
                <p>${vote_average}</p>
            </div>
        </button>
    </li>`
      )
      .join('');

    rootRefs.moviesContainer.classList.add('is-shown');
  }

  async reRenderWithLocale() {
    const urlParams = {
      api_key: API_KEY,
      page: this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
      query: this._query,
    };

    const moviesData = await this.#fetchMovies(this._lastURL, urlParams);

    setTimeout(() => this.#renderMovies(moviesData), MOVIES_TRANSITION_TIME);
  }

  async renderTrending(page) {
    this._lastQueryType !== 'trending' && (this._currentPage = 1);

    const url = '/trending/movie/week';
    const urlParams = {
      api_key: API_KEY,
      page: page ? page : this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
    };

    const trendingMovies = await this.#fetchMovies(url, urlParams);

    setTimeout(
      () => this.#renderMovies(trendingMovies),
      MOVIES_TRANSITION_TIME
    );

    this._lastQueryType = 'trending';
    page && (this._currentPage = page);
  }

  async renderSearched(page) {
    this._lastQueryType !== 'searched' && (this._currentPage = 1);

    const url = '/search/movie';
    const urlParams = {
      api_key: API_KEY,
      page: page ? page : this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
      query: this._query,
    };

    const searchedMovies = await this.#fetchMovies(url, urlParams);

    setTimeout(
      () => this.#renderMovies(searchedMovies),
      MOVIES_TRANSITION_TIME
    );

    this._lastQueryType = 'searched';
    page && (this._currentPage = page);
  }
}
