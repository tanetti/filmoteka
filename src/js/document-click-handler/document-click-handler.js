export const documentClickHandler = event => {
  const dataset = event.target.dataset;

  if (!dataset) return;

  console.log(dataset);
};
