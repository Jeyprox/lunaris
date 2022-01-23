async function fetchAPI(query, { variables } = {}) {
  const res = await fetch(process.env.GRAPHCMS_PROJECT_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GRAPHCMS_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const json = await res.json();

  if (json.errors) {
    console.log(process.env.GRAPHCMS_PROJECT_ID);
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }

  return json.data;
}

export async function getCityByName(name) {
  const data = await fetchAPI(
    `
      query CityByName($name: String!) {
        city(where: {cityName: $name}, stage: PUBLISHED) {
            id,
            cityName,
            landingTitle,
            landingSubtitle,
            landingImage {
                id,
                url
            },
            cityDescription,
            cityMap {
                id,
                url
            }
            cityCoordinates,
            citizenCount,
            cityStatus,
            cityColour {hex},
            governmentPositions {
                ingameName,
                discordName
                governmentPositions,
                ministerPosition
            },
            server
        }
        moreCities: cities(orderBy: cityRelevance_DESC, first: 3, where: {cityName_not_in: [$name]}) {
            id,
            cityName,
            cityMap {
                id,
                url
            },
            cityColour {hex},
            cityCoordinates,
            server,
        }
      }`,
    {
      variables: {
        name,
      },
    }
  );
  return data;
}

export async function getAllCities() {
  const data = await fetchAPI(`
      {
        cities(orderBy: cityRelevance_DESC) {
          id,
          cityName
        }
      }
    `);
  return data.cities;
}

export async function getAllCityPreviews() {
  const data = await fetchAPI(
    `
      {
        cities(orderBy: cityRelevance_DESC) {
          id,
          cityName,
          cityMap {
            id,
            url
          }
        }
      }
    `
  );
  return data.cities;
}
