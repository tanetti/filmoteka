const STATE_LS_KEY = 'filmotekaPageState';

export class State {
  constructor() {
    this._locale = null;
    this._mode = null;
    this._currentPage = 'home';
    this._currentMoviePage = 1;
    this._yPosition = 0;

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

  get yPosition() {
    return this._yPosition;
  }

  set yPosition(yPosition) {
    this._yPosition = yPosition;

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

  init() {
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
    this._yPosition = savedState.yPosition;
    this._genresEN = savedState.genresEN;
    this._genresUA = savedState.genresUA;
  }

  #loadStateFromLS() {
    const loadedState = localStorage.getItem(STATE_LS_KEY);
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
            'yPosition',
            'genresEN',
            'genresUA',
          ].includes(key)
        )
          throw new Error();
      }

      return parsedState;
    } catch {
      localStorage.removeItem(STATE_LS_KEY);
    }
  }

  #recordStateToLS() {
    // console.log(this._genresEN);
    // console.log(this._genresUA);
    const currentState = {
      locale: this._locale,
      mode: this._mode,
      currentPage: this._currentPage,
      currentMoviePage: this._currentMoviePage,
      yPosition: this._yPosition,
      genresEN: this._genresEN,
      genresUA: this._genresUA,
    };

    localStorage.setItem(STATE_LS_KEY, JSON.stringify(currentState));
  }
}
