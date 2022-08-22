import { rootRefs } from '../root-refs';
import { MAIN_TRANSITION_TIME } from '../constants';

export const setPageMode = mode => {
  const bodyClassRef = document.body.classList;

  if (mode === 'light' && bodyClassRef.contains('dark-mode')) {
    bodyClassRef.remove('dark-mode');
    rootRefs.modeSwitch.checked = false;
    return;
  }

  if (mode === 'dark' && !bodyClassRef.contains('dark-mode')) {
    bodyClassRef.add('dark-mode');
    rootRefs.modeSwitch.checked = true;
  }

  if (!bodyClassRef.contains('is-loaded'))
    setTimeout(() => bodyClassRef.add('is-loaded'), MAIN_TRANSITION_TIME);
};
