import axios from 'axios';
import { rootRefs } from '../root-refs';
import {
  API_KEY,
  API_BASE_URL,
  MOVIES_TRANSITION_TIME,
  TABLET_MIN_WIDTH,
  DESKTOP_MIN_WIDTH,
  MAIN_TRANSITION_TIME,
  MOBILE_MOVIES_WAIT_TO_LOAD,
  TABLET_MOVIES_WAIT_TO_LOAD,
  DESKTOP_MOVIES_WAIT_TO_LOAD,
} from '../constants';

axios.defaults.baseURL = API_BASE_URL;

export class Fetcher {
  constructor() {
    this._pageState = null;
    this._localeDB = null;
    this._renderPagination = null;
    this._renderError = null;
    this._noImage = null;
    this._createMoviesMarkupArray = null;
    this._nextPageDesktopMovie = null;
    this._calculateMoviesPartialLoadPoints = null;

    this._query = null;
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
    const {
      pageState,
      localeDB,
      createMoviesMarkupArray,
      nextPageDesktopMovie,
      paginationRendering,
      errorRendering,
      noImage,
      calculateMoviesPartialLoadPoints,
    } = settings;

    this._pageState = pageState;
    this._localeDB = localeDB;
    this._createMoviesMarkupArray = createMoviesMarkupArray;
    this._nextPageDesktopMovie = nextPageDesktopMovie;
    this._renderPagination = paginationRendering;
    this._renderError = errorRendering;
    this._noImage = noImage;
    this._calculateMoviesPartialLoadPoints = calculateMoviesPartialLoadPoints;
  }

  async fetchMovieByID(movieID, language) {
    const url = `/movie/${movieID}`;
    const urlParams = {
      api_key: API_KEY,
      language: language === 'en' ? 'en-US' : 'uk-UA',
    };

    const fetchData = await axios
      .get(url, { params: urlParams })
      .catch(() => 'error');

    if (fetchData === 'error') return fetchData;

    fetchData.data.genre_ids = fetchData.data.genres.map(
      genreObj => genreObj.id
    );

    return fetchData.data;
  }

  async fetchVideos(movieID) {
    const url = `/movie/${movieID}/videos`;
    const urlParams = {
      api_key: API_KEY,
      language: this._pageState.locale === 'en' ? 'en-US' : 'uk-UA',
    };

    const fetchData = await axios
      .get(url, { params: urlParams })
      .catch(() => 'error');

    if (fetchData === 'error') return fetchData;

    if (
      (fetchData.data.results.length === 0 &&
        this._pageState.locale === 'en') ||
      (fetchData.data.results.length > 0 && this._pageState.locale === 'ua')
    )
      return fetchData.data.results;

    const urlParamsEN = {
      api_key: API_KEY,
      language: 'en-US',
    };

    const fetchDataEN = await axios
      .get(url, { params: urlParamsEN })
      .catch(() => 'error');

    if (fetchDataEN === 'error') return fetchDataEN;

    return fetchDataEN.data.results;
  }

  async #fetchGenres() {
    const url = '/genre/movie/list';
    const urlParams = {
      api_key: API_KEY,
      language: this._pageState.locale === 'en' ? 'en-US' : 'uk-UA',
    };

    const fetchData = await axios
      .get(url, { params: urlParams })
      .catch(() => this.#error('general'));

    if (!fetchData) return;

    return fetchData?.data?.genres;
  }

  async #fetchMovies(url, urlParams) {
    this.#hideContent();

    if (
      !this._pageState[`genres${this._pageState.locale === 'en' ? 'EN' : 'UA'}`]
    ) {
      const fetchedGenres = await this.#fetchGenres();

      this._pageState[
        `genres${this._pageState.locale === 'en' ? 'EN' : 'UA'}`
      ] = fetchedGenres;
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
          this.#error('no-results');
          return;
        }

        this.#error('general');
      })
      .finally(() => (this._abortController = null));

    this._lastURL = url;

    if (fetchData?.data?.results?.length === 0) this.#error('no-results');

    return fetchData?.data;
  }

  #showContent() {
    rootRefs.moviesError.classList.remove('is-shown');
    rootRefs.moviesLoader.classList.remove('is-shown');
    rootRefs.moviesContainer.classList.add('is-shown');
    rootRefs.moviesPagination.classList.add('is-shown');
  }

  #hideContent() {
    rootRefs.moviesLoader.classList.add('is-shown');
    rootRefs.moviesError.classList.remove('is-shown');
    rootRefs.moviesContainer.classList.remove('is-shown');
    rootRefs.moviesPagination.classList.remove('is-shown');
  }

  #error(error) {
    rootRefs.moviesError.innerHTML = this._renderError(
      error,
      this._localeDB,
      this._pageState
    );

    rootRefs.moviesLoader.classList.remove('is-shown');
    rootRefs.moviesContainer.classList.remove('is-shown');
    rootRefs.moviesPagination.classList.remove('is-shown');
    rootRefs.moviesError.classList.add('is-shown');

    this._lastQueryData = null;

    setTimeout(() => {
      rootRefs.moviesContainer.innerHTML = '';
      rootRefs.moviesPagination.innerHTML = '';
    }, MAIN_TRANSITION_TIME);
  }

  #onImageLoad(rest = false, dataLenght, { target }) {
    target.classList.remove('is-loading');

    target.removeEventListener('error', this.#onImageError);

    if (rest) return;

    this._currentImagesLoaded += 1;

    if (window.innerWidth < TABLET_MIN_WIDTH) {
      if (
        this._currentImagesLoaded ===
        Math.min(MOBILE_MOVIES_WAIT_TO_LOAD, dataLenght)
      )
        this.#showContent();
    }

    if (
      window.innerWidth < DESKTOP_MIN_WIDTH &&
      window.innerWidth >= TABLET_MIN_WIDTH
    ) {
      if (
        this._currentImagesLoaded ===
        Math.min(TABLET_MOVIES_WAIT_TO_LOAD, dataLenght)
      )
        this.#showContent();
    }

    if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
      if (
        this._currentImagesLoaded ===
        Math.min(DESKTOP_MOVIES_WAIT_TO_LOAD, dataLenght)
      )
        this.#showContent();
    }
  }

  #onImageError({ target }) {
    target.src = this._noImage;
  }

  #renderMovies(moviesData, isReRender = false) {
    if (this._observerIteration === 0 || isReRender)
      rootRefs.moviesContainer.innerHTML = '';

    this._currentImagesLoaded = 0;

    const moviesMarkupArray = this._createMoviesMarkupArray(
      moviesData,
      this._pageState,
      this._localeDB
    );

    const { start, end, needToLoad } = this._calculateMoviesPartialLoadPoints(
      isReRender,
      this._observerIteration,
      moviesMarkupArray
    );

    rootRefs.moviesContainer.insertAdjacentHTML(
      'beforeend',
      moviesMarkupArray.slice(start, end).join('')
    );

    if (end < moviesMarkupArray.length - 1)
      this.#createInfiniteScrollObserver(moviesData);

    if (
      end >= moviesMarkupArray.length - 1 &&
      window.innerWidth >= DESKTOP_MIN_WIDTH &&
      this._lastQueryData.page < this._lastQueryData.total_pages
    )
      rootRefs.moviesContainer.insertAdjacentHTML(
        'beforeend',
        this._nextPageDesktopMovie(this._localeDB, this._pageState)
      );

    const images =
      rootRefs.mainContainer.querySelectorAll('[data-movie_image]');

    for (let i = 0; i < needToLoad; i += 1) {
      images[i]?.addEventListener(
        'load',
        this.#onImageLoad.bind(this, false, moviesMarkupArray.length),
        {
          once: true,
        }
      );

      images[i]?.addEventListener('error', this.#onImageError.bind(this), {
        once: true,
      });
    }

    for (let i = needToLoad; i < images.length; i += 1) {
      images[i]?.addEventListener(
        'load',
        this.#onImageLoad.bind(this, true, moviesMarkupArray.length),
        {
          once: true,
        }
      );

      images[i]?.addEventListener('error', this.#onImageError.bind(this), {
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

  #identifyCurrentPage() {
    if (this._pageState.currentPage === 'home')
      return this._pageState.currentMoviePage;

    if (
      this._pageState.currentPage === 'library' &&
      this._pageState.currentLibrarySection === 'watched'
    )
      return this._pageState.currentLibraryWatchedPage;

    if (
      this._pageState.currentPage === 'library' &&
      this._pageState.currentLibrarySection === 'queue'
    )
      return this._pageState.currentLibraryQueuePage;
  }

  async reRenderMovies(isTriggeredByPagination = false) {
    if (isTriggeredByPagination) {
      this._observerIteration = 0;
    }

    const urlParams = {
      api_key: API_KEY,
      page: this._pageState.currentMoviePage,
      language: this._pageState.locale === 'en' ? 'en-US' : 'uk-UA',
      query: this._query,
    };

    let fetchData = null;

    if (this._pageState.currentPage === 'library') {
      this.#hideContent();
      fetchData = this._pageState.getLibrary(this.#identifyCurrentPage());
    } else {
      fetchData = await this.#fetchMovies(this._lastURL, urlParams);
    }

    if (!fetchData) return this.#error('general');
    if (fetchData.results.length === 0) return this.#error('no-results');

    this._lastQueryData = fetchData;

    setTimeout(
      () => this.#renderMovies(fetchData.results, true),
      MOVIES_TRANSITION_TIME
    );

    rootRefs.moviesPagination.innerHTML = this._renderPagination(
      this.#identifyCurrentPage(),
      fetchData.total_pages
    );
  }

  reRenderMoviesByResizing() {
    if (!this._lastQueryData) return;

    this.#renderMovies(this._lastQueryData.results, true);
    rootRefs.moviesPagination.innerHTML = this._renderPagination(
      this.#identifyCurrentPage(),
      this._lastQueryData.total_pages
    );
  }

  async renderTrending(page) {
    if (this._lastQueryType === 'searched') {
      this._pageState.currentMoviePage = 1;
      this._pageState.currentQuery = null;
    }

    this._observerIteration = 0;
    this._lastQueryData = null;

    if (page) this._pageState.currentMoviePage = page;

    const url = '/trending/movie/week';
    const urlParams = {
      api_key: API_KEY,
      page: this._pageState.currentMoviePage,
      language: this._pageState.locale === 'en' ? 'en-US' : 'uk-UA',
    };

    const fetchData = await this.#fetchMovies(url, urlParams);

    if (!fetchData) return this.#error('general');
    if (fetchData.results.length === 0) return this.#error('no-results');

    this._lastQueryData = fetchData;

    setTimeout(
      () => this.#renderMovies(fetchData.results),
      MOVIES_TRANSITION_TIME
    );

    rootRefs.moviesPagination.innerHTML = this._renderPagination(
      this._pageState.currentMoviePage,
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
      this._pageState.currentMoviePage = 1;
    }

    this._observerIteration = 0;
    this._lastQueryData = null;

    if (page) this._pageState.currentMoviePage = page;

    const url = '/search/movie';
    const urlParams = {
      api_key: API_KEY,
      page: this._pageState.currentMoviePage,
      language: this._pageState.locale === 'en' ? 'en-US' : 'uk-UA',
      query: this._query,
    };

    const fetchData = await this.#fetchMovies(url, urlParams);

    if (!fetchData) return this.#error('general');
    if (fetchData.results.length === 0) return this.#error('no-results');

    this._lastQueryData = fetchData;

    setTimeout(
      () => this.#renderMovies(fetchData.results),
      MOVIES_TRANSITION_TIME
    );

    rootRefs.moviesPagination.innerHTML = this._renderPagination(
      this._pageState.currentMoviePage,
      fetchData.total_pages
    );

    this._lastQueryType = 'searched';
    this._pageState.currentQuery = this._query;
  }

  renderLibrary(page) {
    this.#hideContent();

    this._observerIteration = 0;

    const fetchData = this._pageState.getLibrary(
      page ? page : this.#identifyCurrentPage()
    );

    if (!fetchData) return this.#error('general');
    if (fetchData.results.length === 0) return this.#error('no-results');

    this._lastQueryData = fetchData;

    setTimeout(
      () => this.#renderMovies(fetchData.results),
      MOVIES_TRANSITION_TIME
    );

    rootRefs.moviesPagination.innerHTML = this._renderPagination(
      this.#identifyCurrentPage(),
      fetchData.total_pages
    );

    this._lastQueryType = 'library';
  }
}
