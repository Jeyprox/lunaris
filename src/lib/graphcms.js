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
                governmentPosition,
                ministerPosition
            },
            server
        }
        moreCities: cities(orderBy: cityRelevance_DESC, first: 3, where: {cityName_not_in: [$name]}) {
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
        cities {
          cityName
        }
      }
    `);
  return data.cities;
}

export async function getAllCityPreviews(preview) {
  const data = await fetchAPI(
    `
      {
        posts(orderBy: date_DESC, first: 20) {
          title
          slug
          excerpt
          date
          coverImage {
            url(transformation: {
              image: {
                resize: {
                  fit:crop,
                  width:2000,
                  height:1000
                }
              }
            })
          }
        }
      }
    `,
    { preview }
  );
  return data.posts;
}
