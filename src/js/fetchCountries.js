const BASE_URL = 'https://restcountries.com/v2';

export async function fetchCountries(searchQuery) {
  const response = await fetch(`${BASE_URL}/name/${searchQuery}`);
  if (response.status === 404) {
    throw new Error('Country not found');
  }
  if (!response.ok) {
    throw new Error(response.status);
  }
  const countries = await response.json();
  if (countries.length > 10) {
    return [];
  }
  return countries;
}
