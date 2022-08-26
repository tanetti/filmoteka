import axios from 'axios';
import { rootRefs } from '../root-refs';
import { pageState } from '../state';
import { localeDB } from '../locale';
import * as noImage from '../../images/no-image.png';
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
    this._currentPage = pageState.currentMoviePage;

    this._genres =
      pageState[`genres${pageState.locale === 'en' ? 'EN' : 'UA'}`];

    this._renderPagination = null;

    this._lastURL = null;
    this._lastQuery = null;
    this._lastQueryType = null;
    this._lastQueryData = null;

    this._observerIteration = 0;
    this._currentImagesLoaded = 0;

    this._abortController = null;

    this._infiniteScrollObserver = null;
  }

  set query(value) {
    this._query = value;
  }

  get queryData() {
    return this._lastQueryData?.results;
  }

  init(settings) {
    const { paginationRendering } = settings;

    this._renderPagination = paginationRendering;

    console.log(this._renderPagination);
  }

  async #fetchGenres() {
    const url = '/genre/movie/list';
    const urlParams = {
      api_key: API_KEY,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
    };

    const fetchData = await axios.get(url, { params: urlParams }).catch();

    return fetchData.data.genres;
  }

  async #fetchMovies(url, urlParams) {
    rootRefs.moviesLoader.classList.add('is-shown');
    rootRefs.moviesContainer.classList.remove('is-shown');
    rootRefs.moviesPagination.classList.remove('is-shown');

    if (!this._genres) {
      const genres = await this.#fetchGenres();

      this._genres = genres;
      pageState[`genres${pageState.locale === 'en' ? 'EN' : 'UA'}`] =
        this._genres;
    }

    if (this._abortController) {
      this._abortController.abort();

      this._abortController = null;
    }

    this._abortController = new AbortController();

    const fetchData = await axios
      .get(url, { params: urlParams, signal: this._abortController.signal })
      .catch(error => {
        if (error.message === 'canceled') return;

        if (error.response?.status === 404) {
          console.log(localeDB[pageState.locale].fetcher.errors.notFound);
          return;
        }

        console.log(localeDB[pageState.locale].fetcher.errors.general);
      })
      .finally(() => (this._abortController = null));

    this._lastURL = url;

    return fetchData?.data;
  }

  #createGenresDescription(genre_ids) {
    const currGenresArray = genre_ids.map(genreID => {
      let currGenre = null;

      for (const savedGenre of this._genres) {
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
  }

  #choseImageSize(poster_path) {
    if (window.innerWidth > DESKTOP_MIN_WIDTH)
      return `src="https://image.tmdb.org/t/p/w500${poster_path}"`;

    return `src="https://image.tmdb.org/t/p/w342${poster_path}"`;
  }

  #createMoviesMarkupArray(moviesData) {
    const moviesMarkupArray = moviesData.map(movieData => {
      const { id, title, poster_path, release_date, vote_average, genre_ids } =
        movieData;
      return `
    <li class="movie">
        <button class="movie__container" aria-label="${title}" aria-expanded="false" data-movie="${id}">
          <div class="movie__image-container">  
            <img class="movie__image is-loading" ${
              poster_path
                ? this.#choseImageSize(poster_path)
                : `src="${noImage}"`
            } width="400" height="600" alt="${title}" loading="lazy" data-movie_image></img>
          </div>
          <div class="movie__data">
            <p class="movie__title">${title}</p>
            <p class="movie__description">
              <span class="movie__ganres">${this.#createGenresDescription(
                genre_ids
              )}</span>
              <span class="movie__year">${
                release_date ? release_date.substring(0, 4) : 'N/A'
              }</span>
            </p>
          </div>
          <div class="movie__rating">
            <span">${vote_average.toFixed(1)}</span>
          </div>
          <div class="movie__trailer">
          </div>
        </button>
    </li>`;
    });

    return moviesMarkupArray;
  }

  #showContent() {
    rootRefs.moviesLoader.classList.remove('is-shown');
    rootRefs.moviesContainer.classList.add('is-shown');
    rootRefs.moviesPagination.classList.add('is-shown');
  }

  #onImageLoad(rest = false, { currentTarget }) {
    if (rest) {
      currentTarget.classList.remove('is-loading');
      return;
    }

    this._currentImagesLoaded += 1;

    if (window.innerWidth < TABLET_MIN_WIDTH) {
      if (this._currentImagesLoaded === 1) this.#showContent();
    }

    if (
      window.innerWidth < DESKTOP_MIN_WIDTH &&
      window.innerWidth >= TABLET_MIN_WIDTH
    ) {
      if (this._currentImagesLoaded === 2) this.#showContent();
    }

    if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
      if (this._currentImagesLoaded === 3) this.#showContent();
    }
  }

  #renderMovies(moviesData, isReRender = false) {
    if (this._observerIteration === 0 || isReRender)
      rootRefs.moviesContainer.innerHTML = '';

    this._currentImagesLoaded = 0;

    const moviesMarkupArray = this.#createMoviesMarkupArray(moviesData);

    let start = null;
    let end = null;
    let needToLoad = null;

    if (window.innerWidth < TABLET_MIN_WIDTH) {
      needToLoad = 1;
      start = isReRender
        ? 0
        : this._observerIteration * MOBILE_MAX_MOVIES_RENDER;
      end =
        this._observerIteration * MOBILE_MAX_MOVIES_RENDER +
          MOBILE_MAX_MOVIES_RENDER >=
        moviesMarkupArray.length
          ? moviesMarkupArray.length
          : this._observerIteration * MOBILE_MAX_MOVIES_RENDER +
            MOBILE_MAX_MOVIES_RENDER;
    }

    if (
      window.innerWidth < DESKTOP_MIN_WIDTH &&
      window.innerWidth >= TABLET_MIN_WIDTH
    ) {
      needToLoad = 2;
      start = isReRender
        ? 0
        : this._observerIteration * TABLET_MAX_MOVIES_RENDER;
      end =
        this._observerIteration * TABLET_MAX_MOVIES_RENDER +
          TABLET_MAX_MOVIES_RENDER >=
        moviesMarkupArray.length
          ? moviesMarkupArray.length
          : this._observerIteration * TABLET_MAX_MOVIES_RENDER +
            TABLET_MAX_MOVIES_RENDER;
    }

    if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
      needToLoad = 3;
      start = isReRender
        ? 0
        : this._observerIteration * DESKTOP_MAX_MOVIES_RENDER;
      end =
        this._observerIteration * DESKTOP_MAX_MOVIES_RENDER +
          DESKTOP_MAX_MOVIES_RENDER >=
        moviesMarkupArray.length
          ? moviesMarkupArray.length
          : this._observerIteration * DESKTOP_MAX_MOVIES_RENDER +
            DESKTOP_MAX_MOVIES_RENDER;
    }

    rootRefs.moviesContainer.insertAdjacentHTML(
      'beforeend',
      moviesMarkupArray.slice(start, end).join('')
    );

    if (end < moviesMarkupArray.length - 1)
      this.#createInfiniteScrollObserver(moviesData);

    const images =
      rootRefs.mainContainer.querySelectorAll('[data-movie_image]');

    for (let i = 0; i < needToLoad; i += 1) {
      images[i]?.addEventListener('load', this.#onImageLoad.bind(this, false), {
        once: true,
      });
    }

    for (let i = needToLoad; i < images.length; i += 1) {
      images[i]?.addEventListener('load', this.#onImageLoad.bind(this, true), {
        once: true,
      });
    }
  }

  #createInfiniteScrollObserver(moviesData) {
    this._infiniteScrollObserver = new IntersectionObserver(
      this.#onInfiniteScrollIntersection.bind(this, moviesData),
      { threshold: 0.3 }
    );
    const lastLoadedImage = rootRefs.moviesContainer.lastElementChild;

    lastLoadedImage && this._infiniteScrollObserver.observe(lastLoadedImage);
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

  async reRenderMovies(isTriggeredByPagination = false) {
    if (isTriggeredByPagination) {
      this._currentPage = pageState.currentMoviePage;
      this._observerIteration = 0;
    }

    this._genres =
      pageState[`genres${pageState.locale === 'en' ? 'EN' : 'UA'}`];

    const urlParams = {
      api_key: API_KEY,
      page: this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
      query: this._query,
    };

    const fetchData = await this.#fetchMovies(this._lastURL, urlParams);

    if (!fetchData) return;

    this._lastQueryData = fetchData;

    setTimeout(
      () => this.#renderMovies(fetchData.results, true),
      MOVIES_TRANSITION_TIME
    );

    rootRefs.moviesPagination.innerHTML = this._renderPagination(
      this._currentPage,
      fetchData.total_pages
    );
  }

  reRenderMoviesByResizing() {
    this.#renderMovies(this._lastQueryData.results, true);
    rootRefs.moviesPagination.innerHTML = this._renderPagination(
      this._currentPage,
      this._lastQueryData.total_pages
    );
  }

  async renderTrending(page) {
    if (this._lastQueryType === 'searched') {
      this._currentPage = 1;
      pageState.currentMoviePage = this._currentPage;
      pageState.currentQuery = null;
      this._observerIteration = 0;
      this._lastQueryData = null;
    }

    if (page) {
      this._currentPage = page;
      pageState.currentMoviePage = this._currentPage;
    }

    const url = '/trending/movie/week';
    const urlParams = {
      api_key: API_KEY,
      page: page ? page : this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
    };

    const fetchData = await this.#fetchMovies(url, urlParams);

    if (!fetchData) return;

    this._lastQueryData = fetchData;

    setTimeout(
      () => this.#renderMovies(fetchData.results),
      MOVIES_TRANSITION_TIME
    );

    rootRefs.moviesPagination.innerHTML = this._renderPagination(
      this._currentPage,
      fetchData.total_pages
    );

    this._lastQueryType = 'trending';
    this._lastQuery = null;
  }

  async renderSearched(page) {
    if (
      this._lastQueryType === 'trending' ||
      (this._lastQuery !== this._query && this._lastQuery !== null)
    ) {
      this._currentPage = 1;
      pageState.currentMoviePage = this._currentPage;
      this._observerIteration = 0;
      this._lastQueryData = null;
    }

    if (page) {
      this._currentPage = page;
      pageState.currentMoviePage = this._currentPage;
    }

    const url = '/search/movie';
    const urlParams = {
      api_key: API_KEY,
      page: page ? page : this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
      query: this._query,
    };

    const fetchData = await this.#fetchMovies(url, urlParams);

    if (!fetchData) return;

    this._lastQueryData = fetchData;

    setTimeout(
      () => this.#renderMovies(fetchData.results),
      MOVIES_TRANSITION_TIME
    );

    rootRefs.moviesPagination.innerHTML = this._renderPagination(
      this._currentPage,
      fetchData.total_pages
    );

    this._lastQueryType = 'searched';
    this._lastQuery = this._query;
    pageState.currentQuery = this._lastQuery;
  }
}
