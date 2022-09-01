export class State {
  constructor() {
    this._localStorageKey = null;

    this._locale = null;
    this._mode = null;
    this._currentPage = 'home';
    this._currentLibrarySection = 'watched';
    this._currentMoviePage = 1;
    this._currentLibraryWatchedPage = 1;
    this._currentLibraryQueuePage = 1;
    this._currentQuery = null;

    this._genresEN = null;
    this._genresUA = null;

    this._watched = { en: [], ua: [] };
    this._queue = { en: [], ua: [] };

    this._localChanges = false;

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
    if (!['home', 'library'].includes(currentPage)) return;

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

  get currentLibraryWatchedPage() {
    return this._currentLibraryWatchedPage;
  }

  set currentLibraryWatchedPage(currentLibraryWatchedPage) {
    this._currentLibraryWatchedPage = currentLibraryWatchedPage;

    this.#recordStateToLS();
  }

  get currentLibraryQueuePage() {
    return this._currentLibraryQueuePage;
  }

  set currentLibraryQueuePage(currentLibraryQueuePage) {
    this._currentLibraryQueuePage = currentLibraryQueuePage;

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

  get localChanges() {
    return this._localChanges;
  }

  set localChanges(localChanges) {
    this._localChanges = localChanges;

    this.#recordStateToLS();
  }

  get currentLibrarySection() {
    return this._currentLibrarySection;
  }

  set currentLibrarySection(currentLibrarySection) {
    if (!['watched', 'queue'].includes(currentLibrarySection)) return;

    this._currentLibrarySection = currentLibrarySection;

    this.#recordStateToLS();
  }

  isInWatched(movieID) {
    return (
      (this._watched || false) &&
      (this._watched[this._locale] || false) &&
      this._watched[this._locale].find(movie => movie.id === movieID)
    );
  }

  toWached(movieID, movieDataEN, movieDataUA) {
    if (this._currentPage === 'library') this.localChanges = true;

    if (this.isInWatched(movieID)) {
      this.#removeFromWatched(movieID);
      return 'remove';
    }

    let action = 'add';

    if (this.isInQueue(movieID)) {
      this.#removeFromQueue(movieID);
      action = 'switch';
    }

    this._watched['en'].unshift(movieDataEN);
    this._watched['ua'].unshift(movieDataUA);

    this.#recordStateToLS();

    return action;
  }

  #removeFromWatched(movieID) {
    this._watched['en'] = this._watched['en'].filter(
      movie => movie.id !== movieID
    );

    this._watched['ua'] = this._watched['ua'].filter(
      movie => movie.id !== movieID
    );

    this.#recordStateToLS();
  }

  isInQueue(movieID) {
    return (
      (this._queue || false) &&
      (this._queue[this._locale] || false) &&
      this._queue[this._locale].find(movie => movie.id === movieID)
    );
  }

  toQueue(movieID, movieDataEN, movieDataUA) {
    if (this._currentPage === 'library') this.localChanges = true;

    if (this.isInQueue(movieID)) {
      this.#removeFromQueue(movieID);
      return 'remove';
    }

    let action = 'add';

    if (this.isInWatched(movieID)) {
      this.#removeFromWatched(movieID);
      action = 'switch';
    }

    this._queue['en'].unshift(movieDataEN);
    this._queue['ua'].unshift(movieDataUA);

    this.#recordStateToLS();

    return action;
  }

  #removeFromQueue(movieID) {
    this._queue['en'] = this._queue['en'].filter(movie => movie.id !== movieID);

    this._queue['ua'] = this._queue['ua'].filter(movie => movie.id !== movieID);

    this.#recordStateToLS();
  }

  getLibrary(page = 1) {
    let dataNest = null;
    let requestedPage = page;

    if (this._currentLibrarySection === 'watched') {
      dataNest = this._watched[this._locale];
    }

    if (this._currentLibrarySection === 'queue') {
      dataNest = this._queue[this._locale];
    }

    const totalPages = Math.ceil(dataNest.length / 20);

    if (this._currentLibrarySection === 'watched') {
      this.currentLibraryWatchedPage = Math.min(
        this._currentLibraryWatchedPage,
        totalPages || 1
      );

      if (requestedPage > 1)
        requestedPage = Math.min(requestedPage, totalPages || 1);
    }

    if (this._currentLibrarySection === 'queue') {
      this.currentLibraryQueuePage = Math.min(
        this._currentLibraryQueuePage,
        totalPages || 1
      );

      if (requestedPage > 1)
        requestedPage = Math.min(requestedPage, totalPages || 1);
    }

    const results = dataNest.slice(
      (requestedPage - 1) * 20,
      (requestedPage - 1) * 20 + 20
    );

    return { requestedPage, total_pages: totalPages, results };
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

    this._locale = savedState.locale ?? this._locale;
    this._mode = savedState.mode ?? this._mode;
    this._currentPage = savedState.currentPage ?? this._currentPage;
    this._currentMoviePage =
      savedState.currentMoviePage ?? this._currentMoviePage;
    this._currentLibraryWatchedPage =
      savedState.currentLibraryWatchedPage ?? this._currentLibraryWatchedPage;
    this._currentLibraryQueuePage =
      savedState.currentLibraryQueuePage ?? this._currentLibraryQueuePage;
    this._currentLibrarySection =
      savedState.currentLibrarySection ?? this._currentLibrarySection;
    this._currentQuery = savedState.currentQuery ?? this._currentQuery;
    this._genresEN = savedState.genresEN ?? this._genresEN;
    this._genresUA = savedState.genresUA ?? this._genresUA;
    this._watched = savedState.watched ?? this._watched;
    this._queue = savedState.queue ?? this._queue;
    this._localChanges = savedState.localChanges ?? this._localChanges;
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
            'currentLibraryWatchedPage',
            'currentLibraryQueuePage',
            'currentLibrarySection',
            'currentQuery',
            'genresEN',
            'genresUA',
            'watched',
            'queue',
            'localChanges',
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
      currentLibraryWatchedPage: this._currentLibraryWatchedPage,
      currentLibraryQueuePage: this._currentLibraryQueuePage,
      currentLibrarySection: this._currentLibrarySection,
      currentQuery: this._currentQuery,
      genresEN: this._genresEN,
      genresUA: this._genresUA,
      watched: this._watched,
      queue: this._queue,
      localChanges: this._localChanges,
    };

    localStorage.setItem(this._localStorageKey, JSON.stringify(currentState));
  }
}
