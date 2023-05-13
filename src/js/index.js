import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.getElementById('search-box');
const countryList = document.getElementById('country-list');
const countryInfo = document.getElementById('country-info');

function displayCountryList(countries) {
  let countryListItems = '';
  countries.forEach(country => {
    const { name, flag } = country;
    countryListItems += `<li><img src="${flag}" alt="${name}" width="32"> ${name}</li>`;
  });
  countryList.innerHTML = countryListItems;
  countryInfo.innerHTML = '';
}

function displayCountryInfo(country) {
    if (!country || !country.languages) return;
  const { name, capital, population, languages, flag } = country;
  let languagesList = '';
  languages.forEach(({ name }) => {
    languagesList += `${name}, `;
  });
  languagesList = languagesList.slice(0, -2);
  countryInfo.innerHTML = `
    <div>
      <img src="${flag}" alt="${name}" width="200">
      <h2>${name}</h2>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${population.toLocaleString()}</p>
      <p><strong>Languages:</strong> ${languagesList}</p>
    </div>
  `;
  countryList.innerHTML = '';
}

function handleSearch() {
  const searchTerm = searchBox.value.trim();
  if (searchTerm.length >= 2) {
    fetchCountries(searchTerm)
      .then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length === 1) {
          displayCountryInfo(countries[0]);
        } else {
          displayCountryList(countries);
        }
      })
      .catch(error => {
        console.log(error);
        countryList.innerHTML = `<li>Error getting country data. Please try again.</li>`;
      });
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

searchBox.addEventListener('input', debounce(handleSearch, 300));
