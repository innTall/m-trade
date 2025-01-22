import fetchWrapper from './fetchWrapper.js';

export default function getSymbols() {
  return fetchWrapper({
    path: `/market/instruments-info?category=spot`,
  });
}
