export async function fetchCountries(name) {
  const fields = "fields=name,officialName,capital,population,flags/languages/name";
  const url = `https://restcountries.com/v2/name/${name}?${fields}`;

  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("No matching countries found");
    }
  });
}
