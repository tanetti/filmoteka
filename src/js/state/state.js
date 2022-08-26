export class State {
  constructor() {
    this._localStorageKey = null;

    this._locale = null;
    this._mode = null;
    this._currentPage = 'home';
    this._currentMoviePage = 1;
    this._currentQuery = null;

    this._genresEN = null;
    this._genresUA = null;

    this._windowWidth = window.innerWidth;
  }

  get locale() {
    return this._locale;
  }

  set locale(locale) {
    if (!['en', 'ua'].includes(locale)) return;

    this._locale = locale;

    this.#recordStateToLS();
  }

  get mode() {
    return this._mode;
  }

  set mode(mode) {
    if (!['light', 'dark'].includes(mode)) return;

    this._mode = mode;

    this.#recordStateToLS();
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(currentPage) {
    if (!['home', 'libraryA', 'libraryB'].includes(currentPage)) return;

    this._currentPage = currentPage;

    this.#recordStateToLS();
  }

  get currentMoviePage() {
    return this._currentMoviePage;
  }

  set currentMoviePage(currentMoviePage) {
    this._currentMoviePage = currentMoviePage;

    this.#recordStateToLS();
  }

  get currentQuery() {
    return this._currentQuery;
  }

  set currentQuery(currentQuery) {
    this._currentQuery = currentQuery;

    this.#recordStateToLS();
  }

  get windowWidth() {
    return this._windowWidth;
  }

  set windowWidth(windowWidth) {
    this._windowWidth = windowWidth;
  }

  get genresEN() {
    return this._genresEN;
  }

  set genresEN(genresEN) {
    this._genresEN = genresEN;

    this.#recordStateToLS();
  }

  get genresUA() {
    return this._genresUA;
  }

  set genresUA(genresUA) {
    this._genresUA = genresUA;

    this.#recordStateToLS();
  }

  init({ localStorageKey }) {
    this._localStorageKey = localStorageKey;

    const savedState = this.#loadStateFromLS();

    if (!savedState) {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        this._mode = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      } else {
        this._mode = 'light';
      }

      const systemLang = navigator.language || navigator.userLanguage;

      this._locale = ['ru-RU', 'uk-UA', 'ru-UA'].includes(systemLang)
        ? 'ua'
        : 'en';

      return;
    }

    this._locale = savedState.locale;
    this._mode = savedState.mode;
    this._currentPage = savedState.currentPage;
    this._currentMoviePage = savedState.currentMoviePage;
    this._currentQuery = savedState.currentQuery;
    this._genresEN = savedState.genresEN;
    this._genresUA = savedState.genresUA;
  }

  #loadStateFromLS() {
    const loadedState = localStorage.getItem(this._localStorageKey);
    if (!loadedState) return;

    try {
      const parsedState = JSON.parse(loadedState);

      for (const key of Object.keys(parsedState)) {
        if (
          ![
            'locale',
            'mode',
            'currentPage',
            'currentMoviePage',
            'currentQuery',
            'genresEN',
            'genresUA',
          ].includes(key)
        )
          throw new Error();
      }

      return parsedState;
    } catch {
      localStorage.removeItem(this._localStorageKey);
    }
  }

  #recordStateToLS() {
    const currentState = {
      locale: this._locale,
      mode: this._mode,
      currentPage: this._currentPage,
      currentMoviePage: this._currentMoviePage,
      currentQuery: this._currentQuery,
      genresEN: this._genresEN,
      genresUA: this._genresUA,
    };

    localStorage.setItem(this._localStorageKey, JSON.stringify(currentState));
  }
}