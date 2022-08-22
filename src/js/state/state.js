const STATE_LS_KEY = 'filmotekaPageState';

export class State {
  constructor() {
    this._locale = 'en';
    this._mode = 'light';
    this._currentPage = 'home';
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

  init() {
    const savedState = this.#loadStateFromLS();

    if (!savedState) return;
    this._locale = savedState.locale;
    this._mode = savedState.mode;
    this._currentPage = savedState.currentPage;
  }

  #loadStateFromLS() {
    const loadedState = localStorage.getItem(STATE_LS_KEY);
    if (!loadedState) return;

    try {
      const parsedState = JSON.parse(loadedState);

      for (const key of Object.keys(parsedState)) {
        if (!['locale', 'mode', 'currentPage'].includes(key)) throw new Error();
      }

      return parsedState;
    } catch {
      localStorage.removeItem(STATE_LS_KEY);
    }
  }

  #recordStateToLS() {
    const currentState = {
      locale: this._locale,
      mode: this._mode,
      currentPage: this._currentPage,
    };

    localStorage.setItem(STATE_LS_KEY, JSON.stringify(currentState));
  }
}
