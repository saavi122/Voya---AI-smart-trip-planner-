export async function searchCities(query, limit = 8) {

    const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=${limit}`,
        {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": "88f7b112admsh869ae9dd5b1e90cp172a",
                "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
            }
        }
    );

    const data = await response.json();

    return data.data.map(city => ({
        id: city.id,
        name: city.city,
        country: city.country,
        region: city.region,
        population: city.population
    }));

}