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
    this._currentPage = pageState.currentMoviePage;

    this._lastURL = null;
    this._lastQuery = null;
    this._lastQueryType = null;

    this._observerIteration = 0;

    this._infiniteScrollObserver = null;
  }

  set query(value) {
    this._query = value;
  }

  async #fetchMovies(url, urlParams) {
    rootRefs.moviesContainer.classList.remove('is-shown');

    const { data } = await axios
      .get(url, { params: urlParams })
      .catch(error => {
        if (error.response.status === 404) {
          console.log(localeDB[pageState.locale].fetcher.errors.notFound);
          return;
        }

        console.log(localeDB[pageState.locale].fetcher.errors.general);
      });

    this._lastURL = url;

    return data;
  }

  #createMoviesMarkupArray(moviesData) {
    const moviesMarkupArray = moviesData.map(movieData => {
      const { title, original_title, poster_path, release_date, vote_average } =
        movieData;
      return `
    <li class="movie">
        <button class="movie__container" aria-label="${title}" aria-expanded="false" data-movie="${JSON.stringify(
        movieData
      )}">
            <img class="movie__image" src="https://image.tmdb.org/t/p/w500${poster_path}" width="300" alt="${title}" loading="lazy"></img>
            <div class="movie__data">
                <p>
                    ${title}
                    ${pageState.locale === 'ua' ? ` - ${original_title}` : ''}
                </p>
                <p>${release_date}</p>
                <p>${vote_average}</p>
            </div>
        </button>
    </li>`;
    });

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
        moviesMarkupArray.length
          ? moviesMarkupArray.length
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
        moviesMarkupArray.length
          ? moviesMarkupArray.length
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

    rootRefs.moviesContainer.classList.add('is-shown');
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

  #renderPagination(totalPages1) {
    const totalPages = 10;
    if (totalPages === 1) return;

    let paginationMarkup = '';

    if (this._currentPage > 1)
      paginationMarkup += `<button type="button" data-actions="prev"><</button>`;

    paginationMarkup += `<button type="button" ${
      this._currentPage === 1 ? 'disabled="true"' : ''
    } data-actions="1">1</button>`;

    for (let i = 2; i <= Math.min(4, totalPages); i += 1) {
      if (this._currentPage <= 3) {
        paginationMarkup += `<button type="button" ${
          this._currentPage === i ? 'disabled="true"' : ''
        } data-actions="${i}">${i}</button>${
          i === 4 && totalPages - 4 > 1 ? '<span>...</span>' : ''
        }`;
        continue;
      }

      // if (this._currentPage >= totalPages - 2) {
      //   paginationMarkup += `${
      //     i === 2 ? '<span>...</span>' : ''
      //   }<button type="button" ${
      //     this._currentPage === i ? 'disabled="true"' : ''
      //   } data-actions="${i}">${i}</button>;
      //   continue;
      // }

      paginationMarkup += `${
        i === 2 ? '<span>...</span>' : ''
      }<button type="button" ${
        this._currentPage === this._currentPage - 3 + i ? 'disabled="true"' : ''
      } data-actions="${this._currentPage - 3 + i}">${
        this._currentPage - 3 + i
      }</button>${
        i === 4 && totalPages - this._currentPage - 3 + i > 1
          ? '<span>...</span>'
          : ''
      }`;
    }

    // if (totalPages > 2) {
    //   if (totalPages - 2 > 3) {
    //     if (this._currentPage >= 1 && this._currentPage <= 3) {
    //       for (let i = 2; i <= 4; i += 1) {
    // paginationMarkup += `<button type="button" ${
    //   this._currentPage === i ? 'disabled="true"' : ''
    // } data-actions="${i}">${i}</button>`;
    //       }
    //     }
    //   }
    // }

    paginationMarkup += `<button type="button" ${
      this._currentPage === totalPages ? 'disabled="true"' : ''
    } data-actions="${totalPages}">${totalPages}</button>`;

    if (this._currentPage < totalPages)
      paginationMarkup += `<button type="button" data-actions="next">></button>`;

    rootRefs.moviesPagination.innerHTML = paginationMarkup;

    console.log(this._currentPage);
  }

  async reRenderMovies(isTriggeredByPagination = false) {
    if (isTriggeredByPagination) {
      this._currentPage = pageState.currentMoviePage;
      this._observerIteration = 0;
    }

    const urlParams = {
      api_key: API_KEY,
      page: this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
      query: this._query,
    };

    const fetchData = await this.#fetchMovies(this._lastURL, urlParams);

    setTimeout(
      () => this.#renderMovies(fetchData.results, true),
      MOVIES_TRANSITION_TIME
    );

    isTriggeredByPagination && this.#renderPagination(fetchData.total_pages);
  }

  async renderTrending(page) {
    if (this._lastQueryType !== 'trending' && this._lastQueryType !== null) {
      this._currentPage = 1;
      pageState.currentMoviePage = this._currentPage;
      this._observerIteration = 0;
    }

    const url = '/trending/movie/week';
    const urlParams = {
      api_key: API_KEY,
      page: page ? page : this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
    };

    const fetchData = await this.#fetchMovies(url, urlParams);

    setTimeout(
      () => this.#renderMovies(fetchData.results),
      MOVIES_TRANSITION_TIME
    );

    this.#renderPagination(fetchData.total_pages);

    this._lastQueryType = 'trending';
    this._lastQuery = null;
    if (page) {
      this._currentPage = page;
      pageState.currentMoviePage = this._currentPage;
    }
  }

  async renderSearched(page) {
    if (
      (this._lastQueryType !== 'searched' && this._lastQueryType !== null) ||
      this._lastQuery !== this._query
    ) {
      this._currentPage = 1;
      pageState.currentMoviePage = this._currentPage = 1;
      this._observerIteration = 0;
    }

    const url = '/search/movie';
    const urlParams = {
      api_key: API_KEY,
      page: page ? page : this._currentPage,
      language: pageState.locale === 'en' ? 'en-US' : 'uk-UA',
      query: this._query,
    };

    const fetchData = await this.#fetchMovies(url, urlParams);

    setTimeout(
      () => this.#renderMovies(fetchData.results),
      MOVIES_TRANSITION_TIME
    );

    this.#renderPagination(fetchData.total_pages);

    this._lastQueryType = 'searched';
    this._lastQuery = this._query;
    if (page) {
      this._currentPage = page;
      pageState.currentMoviePage = this._currentPage;
    }
  }
}
