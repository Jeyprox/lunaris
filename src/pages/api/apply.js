import { GraphQLClient } from "graphql-request";

const sendApplication = async ({ body }, res) => {
  const graphcms = new GraphQLClient(process.env.GRAPHCMS_PROJECT_API, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${process.env.GRAPHCMS_AUTH_TOKEN}`,
    },
  });
  const { cityName, info, nations, professions } = body;
  const { createApplication } = await graphcms.request(
    `
        mutation sendApplication($cityName: String!, $discordName: String!, $ingameName: String!, $joinDate: Float!, $joinReason: String!, $timeZone: Int!, $ingameProfessions: Json!, $recentCitizenships: Json!) {
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
      joinDate: info.joindate,
      joinReason: info.joinreason,
      timeZone: info.timezone,
      ingameProfessions: professions,
      recentCitizenships: nations,
    }
  );
  if (!createApplication) res.status(500).error("Couldn't create application");
  res.status(201).json({ id: createApplication.id });
};

export default sendApplication;
