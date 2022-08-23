import axios from 'axios';
import { rootRefs } from '../root-refs';
import { pageState } from '../state';
import { localeDB } from '../locale';
import {
  API_KEY,
  API_BASE_URL,
  MOVIES_TRANSITION_TIME,
  TABLET_MIN_WIDTH,
  DESKTOP_MIN_WIDTH,
  MOBILE_MAX_MOVIES_RENDER,
  TABLET_MAX_MOVIES_RENDER,
  DESKTOP_MAX_MOVIES_RENDER,
} from '../constants';

axios.defaults.baseURL = API_BASE_URL;

export class Fetcher {
  constructor() {
    this._query = null;
    this._currentPage = 1;

    this._lastURL = null;
    this._lastQuery = null;
    this._lastQueryType = null;

    this._observerIteration = 0;
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

  #createMoviesMarkupArray(moviesData) {
    const moviesMarkupArray = moviesData.map(
      ({ title, original_title, poster_path, release_date, vote_average }) => `
    <li class="movie">
        <button class="movie__container" aria-label="${title}" aria-expanded="false">
            <img class="movie__image" src="https://image.tmdb.org/t/p/w500${poster_path}" width="200" alt="${title}" loading="lazy"></img>
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
    );

    return moviesMarkupArray;
  }

  #renderMovies(moviesData, isReRender = false) {
    if (this._observerIteration === 0 || isReRender)
      rootRefs.moviesContainer.innerHTML = '';

    const moviesMarkupArray = this.#createMoviesMarkupArray(moviesData);

    let start = null;
    let end = null;

    if (window.innerWidth < TABLET_MIN_WIDTH) {
      start = isReRender
        ? 0
        : this._observerIteration * MOBILE_MAX_MOVIES_RENDER;
      end =
        this._observerIteration * MOBILE_MAX_MOVIES_RENDER +
          MOBILE_MAX_MOVIES_RENDER >=
        moviesMarkupArray.length - 1
          ? moviesMarkupArray.length - 1
          : this._observerIteration * MOBILE_MAX_MOVIES_RENDER +
            MOBILE_MAX_MOVIES_RENDER;
    }

    if (
      window.innerWidth < DESKTOP_MIN_WIDTH &&
      window.innerWidth >= TABLET_MIN_WIDTH
    ) {
      start = isReRender
        ? 0
        : this._observerIteration * TABLET_MAX_MOVIES_RENDER;
      end =
        this._observerIteration * TABLET_MAX_MOVIES_RENDER +
          TABLET_MAX_MOVIES_RENDER >=
        moviesMarkupArray.length - 1
          ? moviesMarkupArray.length - 1
          : this._observerIteration * TABLET_MAX_MOVIES_RENDER +
            TABLET_MAX_MOVIES_RENDER;
    }

    if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
      start = isReRender
        ? 0
        : this._observerIteration * DESKTOP_MAX_MOVIES_RENDER;
      end =
        this._observerIteration * DESKTOP_MAX_MOVIES_RENDER +
          DESKTOP_MAX_MOVIES_RENDER >=
        moviesMarkupArray.length - 1
          ? moviesMarkupArray.length - 1
          : this._observerIteration * DESKTOP_MAX_MOVIES_RENDER +
            DESKTOP_MAX_MOVIES_RENDER;
    }

    rootRefs.moviesContainer.insertAdjacentHTML(
      'beforeend',
      moviesMarkupArray.slice(start, end).join('')
    );

    if (end < moviesMarkupArray.length - 1)
      this.#createInfiniteScrollObserver(moviesData);

    rootRefs.moviesContainer.classList.add('is-shown');
  }

  #createInfiniteScrollObserver(moviesData) {
    const infiniteScrollObserver = new IntersectionObserver(
      this.#onInfiniteScrollIntersection.bind(this, moviesData),
      { threshold: 0.3 }
    );
    const lastLoadedImage = rootRefs.moviesContainer.lastElementChild;

    lastLoadedImage && infiniteScrollObserver.observe(lastLoadedImage);
  }

  #onInfiniteScrollIntersection(moviesData, entries, infiniteScrollObserver) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this._observerIteration += 1;

        infiniteScrollObserver.unobserve(entry.target);
        this.#renderMovies(moviesData);
      }
    });
  }

  async reRenderWithLocale() {
    rootRefs.moviesContainer.innerHTML = '';

    const urlParams = {
      api_key: API_KEY,
      page: this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
      query: this._query,
    };

    const moviesData = await this.#fetchMovies(this._lastURL, urlParams);

    setTimeout(
      () => this.#renderMovies(moviesData, true),
      MOVIES_TRANSITION_TIME
    );
  }

  async renderTrending(page) {
    if (this._lastQueryType !== 'trending') {
      this._currentPage = 1;
      this._observerIteration = 0;
    }

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
    this._lastQuery = null;
    page && (this._currentPage = page);
  }

  async renderSearched(page) {
    if (this._lastQueryType !== 'searched' || this._lastQuery !== this._query) {
      this._currentPage = 1;
      this._observerIteration = 0;
    }

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
    this._lastQuery = this._query;
    page && (this._currentPage = page);
  }
}
