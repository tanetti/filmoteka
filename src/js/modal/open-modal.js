import { rootRefs } from '../root-refs';

export const openModal = target => {
  const backdrop = rootRefs.modalBackdrop;
  let modal = null;

  const closeModal = () => {
    backdrop.classList.remove('is-shown');
    modal.classList.remove('is-shown');
    target.ariaExpanded = false;
    document.body.classList.remove('modal-is-open');

    if (target.dataset.click === 'trailer')
      document.querySelector('.trailer-modal__farame-container').innerHTML = '';

    window.removeEventListener('keydown', onEscPress);
  };

  const onEscPress = ({ code }) => {
    if (code !== 'Escape') return;

    closeModal();
  };

  for (const modalWindow of rootRefs.modals) {
    if (modalWindow.dataset.modal !== target.dataset.click) continue;
    modal = modalWindow;
    break;
  }

  if (!modal) return;

  backdrop.classList.add('is-shown');
  modal.classList.add('is-shown');
  target.ariaExpanded = true;
  document.body.classList.add('modal-is-open');

  backdrop.addEventListener('click', closeModal, { once: true });

  modal
    .querySelector('[data-modal_close]')
    .addEventListener('click', closeModal, { once: true });

  window.addEventListener('keydown', onEscPress);
};
