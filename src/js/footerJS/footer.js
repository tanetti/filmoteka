import { rootRefs } from '../root-refs';
import carousel from './slider/slider';

const closeBtn = document.querySelector('[data-footer_close]');

rootRefs.footerButton.addEventListener('click', onOpenModal);

export function onOpenModal() {
  rootRefs.footerBackdrop.classList.add('is-shown');
  rootRefs.footerModal.classList.add('is-shown');
  carousel();
  closeBtn.addEventListener('click', onCloseModal);
  window.addEventListener('keydown', onCloseModalByEsc);
  rootRefs.footerBackdrop.addEventListener(
    'click',
    onCloseModalByClickBackdrop
  );
}

function onCloseModal() {
  rootRefs.footerBackdrop.classList.remove('is-shown');
  rootRefs.footerModal.classList.remove('is-shown');
  closeBtn.removeEventListener('click', onCloseModal);
}

function onCloseModalByEsc(e) {
  if (e.code === 'Escape') {
    onCloseModal();
    window.removeEventListener('keydown', onCloseModalByEsc);
  }
}

function onCloseModalByClickBackdrop(e) {
  if (e.target === e.currentTarget) {
    onCloseModal();
    rootRefs.footerBackdrop.removeEventListener(
      'click',
      onCloseModalByClickBackdrop
    );
  }
}
