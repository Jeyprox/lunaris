import { GraphQLClient } from "graphql-request";

const sendApplication = async ({ body }, res) => {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_PROJECT_API, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.GRAPHCMS_AUTH_TOKEN}`,
    },
  });
  const { cityName, info, joinDate, nations, professions } = body;
  try {
    const response = await graphcms.request(
      `
        mutation sendApplication($cityName: String!, $discordName: String!, $ingameName: String!, $joinDate: Json!, $joinReason: String!, $timeZone: Int!, $ingameProfessions: Json!, $recentCitizenships: Json!) {
          createApplication(
            data: {city: {connect: {cityName: $cityName}}, discordName: $discordName, ingameName: $ingameName, joinDate: $joinDate, joinReason: $joinReason, timeZone: $timeZone, ingameProfessions: $ingameProfessions, recentCitizenships: $recentCitizenships}
          ) {
            id
          }
        }
      `,
      {
        cityName,
        discordName: info.discordtag,
        ingameName: info.username,
        joinDate,
        joinReason: info.joinreason,
        timeZone: info.timezone,
        ingameProfessions: professions,
        recentCitizenships: nations,
      }
    );
    res.status(200).json({ id: response.createApplication.id });
  } catch (err) {
    res.status(400).json({ error: err.response.errors[0].message });
  }
};

export default sendApplication;
