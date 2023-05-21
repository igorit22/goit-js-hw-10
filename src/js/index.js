import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  countryInput: document.querySelector('#search-box'),
  countryList: document.querySelector('#country-list'),
  countryInfo: document.querySelector('#country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.countryInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

async function onSearch() {
  const searchQuery = refs.countryInput.value.trim();

  if (searchQuery === '') {
    clearMarkup(refs.countryList);
    clearMarkup(refs.countryInfo);
    return;
  }

  try {
    const countries = await fetchCountries(searchQuery);
    handleSearchResult(countries);
  } catch (error) {
    if (error.message === 'Too many matches found. Please enter a more specific name.') {
      Notiflix.Notify.info(error.message);
      clearMarkup(refs.countryList);
      clearMarkup(refs.countryInfo);
    } else if (error.message === 'Country not found') {
      Notiflix.Notify.failure('Oops, there is no country with that name.');
    } else {
      Notiflix.Notify.failure('Oops, there was an error. Please try again later.');
      console.log(error);
    }
  }
}

function handleSearchResult(countries) {
  if (countries.length >= 2 && countries.length <= 10) {
    renderCountriesList(countries);
    clearMarkup(refs.countryInfo);
    return;
  }

  if (countries.length === 1) {
    renderCountryCard(countries[0]);
    clearMarkup(refs.countryList);
    return;
  }
  clearMarkup();
}

function clearMarkup(element) {
  if (element) {
    element.innerHTML = '';
  }
}

function renderCountriesList(countries) {
  const markup = countries
    .map(country => {
      return `
        <li class="country-list-item">
          <img src="${country.flag}" alt="${country.name}" class="country-flag">
          <p class="country-name">${country.name}</p>
        </li>
      `;
    })
    .join('');

  refs.countryList.innerHTML = markup;
}

function renderCountryCard(country) {
  const markup = `
    <div class="country-card">
      <img src="${country.flag}" alt="${
    country.name
  }" class="country-flag-card">
      <div class="country-info-card">
        <h2 class="country-name-card">${country.name}</h2>
        <p><span class="country-info-label">Capital:</span> ${
          country.capital
        }</p>
        <p><span class="country-info-label">Population:</span> ${
          country.population
        }</p>
        <p><span class="country-info-label">Languages:</span> ${country.languages
          .map(language => language.name)
          .join(', ')}</p>
      </div>
    </div>
  `;

  refs.countryInfo.innerHTML = markup;
}

window.addEventListener('DOMContentLoaded', () => {
  refs.countryInput.value = '';
  clearMarkup(refs.countryList);
  clearMarkup(refs.countryInfo);
});
