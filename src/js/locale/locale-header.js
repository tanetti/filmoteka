import { rootRefs } from '../root-refs';
import { localeDB } from './';
import { LOCALE_TRANSITION_TIME } from '../constants';
// import { wrap } from 'lodash';

const refs = {
  headerLocaleFields: rootRefs.headerContainer.querySelectorAll(
    '[data-locale_field]'
  ),
  myLibraryBtn: document.querySelector('[data-locale_field="library"]'),
  homeBtnEl: document.querySelector('[data-locale_field="home"]'),
  formEl: document.querySelector('.form-wrap'),
  BtnMyLibraryWatchedEl: document.querySelector('[data-locale_field="watched"]'),
  BtnMyLibraryQueueEl: document.querySelector('[data-locale_field="queue"]'),
};

refs.myLibraryBtn.addEventListener('click', onClickBtnLibrary);
refs.homeBtnEl.addEventListener('click', onClickBtnHome);

function onClickBtnLibrary (e) {
e.preventDefault();

if(refs.myLibraryBtn){
refs.formEl.classList.add('is-hidden');
refs.BtnMyLibraryWatchedEl.classList.remove('is-hidden');
refs.BtnMyLibraryQueueEl.classList.remove('is-hidden');
}



};

function onClickBtnHome (e) {
  e.preventDefault();
  
  if(refs.homeBtnEl){
    refs.formEl.classList.remove('is-hidden');
    refs.BtnMyLibraryWatchedEl.classList.add('is-hidden');
    refs.BtnMyLibraryQueueEl.classList.add('is-hidden');
    }
  };

export const setHeaderLocaleFields = locale => {
  for (const localeField of refs.headerLocaleFields) {
    if (localeField.placeholder) {
      if (document.body.classList.contains('is-loaded')) {
        localeField.classList.add(
          'placeholder-opacity-transition',
          'placeholder-opacity'
        );
        setTimeout(() => {
          localeField.placeholder =
            localeDB[locale].header[localeField.dataset.locale_field];

          localeField.classList.remove('placeholder-opacity');
        }, LOCALE_TRANSITION_TIME);

        continue;
      }

      localeField.placeholder =
        localeDB[locale].header[localeField.dataset.locale_field];
    }

    if (document.body.classList.contains('is-loaded')) {
      localeField.classList.add('opacity-transition', 'opacity');
      setTimeout(() => {
        localeField.textContent =
          localeDB[locale].header[localeField.dataset.locale_field];

        localeField.classList.remove('opacity');
      }, LOCALE_TRANSITION_TIME);

      continue;
    }

    localeField.textContent =
      localeDB[locale].header[localeField.dataset.locale_field];
  }
};
