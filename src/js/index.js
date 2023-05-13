import Notiflix from "notiflix";
import { fetchCountries } from "./fetchCountries";

const refs = {
  countryInput: document.querySelector("#search-box"),
  countryList: document.querySelector("#country-list"),
  countryInfo: document.querySelector("#country-info"),
};

const DEBOUNCE_DELAY = 300;
let debounceTimerId = null;

refs.countryInput.addEventListener("input", onSearch);

function onSearch() {
  const searchQuery = refs.countryInput.value.trim();

  if (!searchQuery) {
    clearMarkup();
    return;
  }

  if (debounceTimerId) {
    clearTimeout(debounceTimerId);
  }

  debounceTimerId = setTimeout(() => {
    fetchCountries(searchQuery)
      .then((countries) => {
        if (countries.length > 10) {
          Notiflix.warning("Too many matches found. Please enter a more specific name.");
          clearMarkup();
          return;
        }

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

        Notiflix.failure("Oops, there was an error. Please try again later.");
        clearMarkup();
      })
      .catch((error) => {
        Notiflix.failure("Oops, there was an error. Please try again later.");
        console.log(error);
      })
      .finally(() => {
        debounceTimerId = null;
      });
  }, DEBOUNCE_DELAY);
}

function clearMarkup(element = refs.countryList) {
  element.innerHTML = "";
}

function renderCountriesList(countries) {
  const markup = countries
    .map((country) => {
      return `
        <li class="country-list-item">
          <img src="${country.flag}" alt="${country.name}" class="country-flag">
          <p class="country-name">${country.name}</p>
        </li>
      `;
    })
    .join("");

  refs.countryList.innerHTML = markup;
}

function renderCountryCard(country) {
  const markup = `
    <div class="country-card">
      <img src="${country.flag}" alt="${country.name}" class="country-flag-card">
      <div class="country-info-card">
        <h2 class="country-name-card">${country.name}</h2>
        <p><span class="country-info-label">Capital:</span> ${country.capital}</p>
        <p><span class="country-info-label">Population:</span> ${country.population}</p>
        <p><span class="country-info-label">Languages:</span> ${country.languages
    .map((language) => language.name)
    .join(", ")}</p>
      </div>
    </div>
  `;

  refs.countryInfo.innerHTML = markup;
}