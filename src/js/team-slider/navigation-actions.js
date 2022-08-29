export const onNavigationClick =
  (sliderView, sliderNavigation, index) => () => {
    if (!sliderNavigation.clickAllowed()) return;

    sliderView.scrollTo(index);
  };

export const followSliderView = (sliderView, sliderNavigation) => () => {
  sliderNavigation.scrollTo(sliderView.selectedScrollSnap());
  selectNavigation(sliderView, sliderNavigation);
};

const selectNavigation = (sliderView, sliderNavigation) => {
  const previous = sliderView.previousScrollSnap();
  const selected = sliderView.selectedScrollSnap();

  sliderNavigation.slideNodes()[previous].classList.remove('is-selected');
  sliderNavigation.slideNodes()[selected].classList.add('is-selected');
};
