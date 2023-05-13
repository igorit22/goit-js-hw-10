const BASE_URL = "https://restcountries.com/v2";

export function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}/name/${searchQuery}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .then((countries) => {
      if (countries.length > 10) {
        return [];
      }

      return countries;
    });
}